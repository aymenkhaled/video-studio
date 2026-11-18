"""Cut vertical Shorts (1080×1920) out of finished long videos (CI only).

Usage: python tools/make_shorts.py <spec.json>
spec: {"channel": "<name on the Short>", "shorts": [{"id", "source": "<path to final.mp4>", "start": s, "end": s, "hook": "line1\\nline2", "footer": "..."}]}
Layout: blurred, darkened full-frame copy as background; the 16:9 clip scaled to 1440×810 and centre-cropped to
1080×810 (burned-in captions stay readable); a hook headline on top and a footer pointing to the full video.
Writes out/shorts/<id>.mp4 (H.264 + AAC 48 kHz, short audio fades).
"""
import json
import subprocess
import sys
from pathlib import Path

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
OUT = Path("out/shorts")


def main():
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    for s in spec["shorts"]:
        dur = float(s["end"]) - float(s["start"])
        if not 10 <= dur <= 60:
            raise SystemExit(f"{s['id']}: duration {dur:.1f}s outside 10–60 s")
        # one drawtext per hook line: a literal newline inside a drawtext textfile renders as a box glyph
        hook_lines = [ln.strip() for ln in s["hook"].splitlines() if ln.strip()]
        for k, ln in enumerate(hook_lines):
            (OUT / f"{s['id']}_hook{k}.txt").write_text(ln, encoding="utf-8")
        foot = OUT / f"{s['id']}_foot.txt"
        foot.write_text(s.get("footer", "Full story: tap the linked video"), encoding="utf-8")
        fc = (
            "[0:v]split=2[a][b];"
            "[a]scale=-2:1920,crop=1080:1920,boxblur=24:2,eq=brightness=-0.28[bg];"
            "[b]scale=1440:810,crop=1080:810[fg];"
            "[bg][fg]overlay=0:520[v1];"
            "[v1]"
            + "".join(
                f"drawtext=fontfile={FONT}:textfile={OUT / (s['id'] + '_hook' + str(k) + '.txt')}:fontsize=78:fontcolor=white:"
                f"borderw=6:bordercolor=black:x=(w-text_w)/2:y={190 + k * 100},"
                for k in range(len(hook_lines))
            )
            +
            f"drawtext=fontfile={FONT}:textfile={foot}:fontsize=52:fontcolor=0xFFD23F:"
            "borderw=5:bordercolor=black:x=(w-text_w)/2:y=1460,"
            f"drawtext=fontfile={FONT}:text='{s.get('channel', spec.get('channel', 'History in Maps'))}':fontsize=40:fontcolor=white@0.85:"
            "borderw=4:bordercolor=black:x=(w-text_w)/2:y=1560[v]"
        )
        af = f"afade=t=in:st=0:d=0.3,afade=t=out:st={dur - 0.5:.2f}:d=0.5"
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", str(s["start"]), "-t", f"{dur:.3f}", "-i", s["source"],
               "-filter_complex", fc, "-map", "[v]", "-map", "0:a", "-af", af,
               "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", "30",
               "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-map_metadata", "-1", "-movflags", "+faststart", str(OUT / f"{s['id']}.mp4")]
        subprocess.run(cmd, check=True)
        print(f"SHORT {s['id']} {dur:.1f}s")


if __name__ == "__main__":
    main()
