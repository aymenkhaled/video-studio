"""Survey a large public media archive in CI (render.yml mode=survey): list every video/photo with duration and
make contact sheets, so clips can be chosen without downloading gigabytes locally.

Usage: python tools/survey_videos.py <zip-url> <outdir>
Writes <outdir>/index.json ({name, size, duration, width, height}) and <outdir>/sheet_<n>.jpg
(one row per video: 4 frames at 10/35/60/85 %, file name burned in).
"""
import json
import subprocess
import sys
import urllib.request
import zipfile
from pathlib import Path

url, out = sys.argv[1], Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
cache = Path(".cache/survey")
cache.mkdir(parents=True, exist_ok=True)
z = cache / "archive.zip"
if not z.exists():
    req = urllib.request.Request(url, headers={"User-Agent": "video-studio-ci/1.0 (open-source educational video pipeline)"})
    with urllib.request.urlopen(req, timeout=600) as r, z.open("wb") as f:
        while chunk := r.read(1 << 22):
            f.write(chunk)
print("zip", z.stat().st_size)
zf = zipfile.ZipFile(z)
vids = [i for i in zf.infolist() if i.filename.lower().endswith((".mov", ".mp4"))]
photos = [i.filename for i in zf.infolist() if i.filename.lower().endswith((".jpg", ".jpeg"))]
index = []
frames_dir = cache / "frames"
frames_dir.mkdir(exist_ok=True)
for k, info in enumerate(vids):
    path = cache / Path(info.filename).name
    if not path.exists():
        with zf.open(info) as src, path.open("wb") as dst:
            while chunk := src.read(1 << 22):
                dst.write(chunk)
    probe = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(path)], capture_output=True, text=True).stdout or "{}")
    dur = float(probe.get("format", {}).get("duration", 0))
    vs = next((s for s in probe.get("streams", []) if s.get("codec_type") == "video"), {})
    index.append({"name": info.filename, "size": info.file_size, "duration": round(dur, 1), "width": vs.get("width"), "height": vs.get("height")})
    tiles = []
    for j, frac in enumerate((0.1, 0.35, 0.6, 0.85)):
        f = frames_dir / f"{k:03d}_{j}.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(dur * frac), "-i", str(path), "-frames:v", "1", "-vf", "scale=480:-2", str(f)])
        tiles.append(f)
    label = f"{k:03d} {Path(info.filename).name} {dur:.0f}s"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *sum((["-i", str(t)] for t in tiles), []), "-filter_complex",
                    f"[0:v][1:v][2:v][3:v]hstack=inputs=4,drawtext=text='{label}':x=10:y=10:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.6",
                    str(frames_dir / f"row_{k:03d}.jpg")])
    path.unlink()  # keep the runner disk free
rows = sorted(frames_dir.glob("row_*.jpg"))
for n in range(0, len(rows), 6):
    batch = rows[n:n + 6]
    subprocess.run(["ffmpeg", "-v", "error", "-y", *sum((["-i", str(r)] for r in batch), []), "-filter_complex",
                    f"{''.join(f'[{i}:v]' for i in range(len(batch)))}vstack=inputs={len(batch)}" if len(batch) > 1 else "null",
                    str(out / f"sheet_{n // 6 + 1:02d}.jpg")])
(out / "index.json").write_text(json.dumps({"videos": index, "photos": photos}, indent=1))
print(f"{len(vids)} videos, {len(photos)} photos")
