"""Fetch licence-checked art + map data for history episodes and derive 2.5D layers (CI only).

Usage: python tools/fetch_media.py [assets/media.json]
Writes (git-ignored, bundled by Remotion):
  public/art/<id>.webp            artwork, long side <= 2000 px
  public/art/<id>_l1.webp/_l2.webp mid/near depth layers (RGBA) when "depth": true
  public/art/index.json           {id: {w, h, layers, credit}}
  public/geo/rivers.json          Natural Earth 1:50m rivers inside bbox (GeoJSON)
  public/geo/relief.webp + relief.json  shaded relief crop (equirectangular) and its bounds
Downloads are cached in .cache/media. sha256 values in the manifest are enforced when present; new ones are printed
as `PIN <name> <sha>` so they can be pinned.
"""
import hashlib
import time
import urllib.error
import io
import json
import re
import sys
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "media"
ART = ROOT / "public" / "art"
GEO = ROOT / "public" / "geo"
UA = {"User-Agent": "video-studio-ci/1.0 (open-source educational video pipeline)"}


def get(url, name, pins):
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / name
    if not path.exists():
        for attempt in range(7):  # polite retries with backoff (Wikimedia answers 429 when busy)
            try:
                req = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(req, timeout=180) as r:
                    path.write_bytes(r.read())
                break
            except urllib.error.HTTPError as e:
                if e.code not in (429, 503) or attempt == 6:
                    raise
                wait = max(15, int(e.headers.get("Retry-After") or 0), 10 * 2 ** attempt)
                print(f"  {e.code} on {name}, retry in {min(wait, 120)} s")
                time.sleep(min(wait, 120))
        time.sleep(4)  # pace requests
    sha = hashlib.sha256(path.read_bytes()).hexdigest()
    if name in pins and pins[name] != sha:
        raise SystemExit(f"sha256 mismatch for {name}: {sha} != pinned {pins[name]}")
    if name not in pins:
        print(f"PIN {name} {sha}")
    return path


def livius_image(page):
    req = urllib.request.Request(page, headers=UA)
    html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    m = re.search(r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"', html) or re.search(r'content="([^"]+)"[^>]+property="og:image"', html)
    if not m:
        raise SystemExit(f"no og:image on {page}")
    return m.group(1)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def depth_layers(img, session):
    """Depth-Anything-V2-Small (ONNX): relative inverse depth, larger = nearer."""
    w, h = img.size
    x = np.asarray(img.convert("RGB").resize((518, 518), Image.BICUBIC), dtype=np.float32) / 255.0
    x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
    x = x.transpose(2, 0, 1)[None]
    d = session.run(None, {session.get_inputs()[0].name: x})[0].squeeze()
    d = (d - d.min()) / max(1e-6, d.max() - d.min())
    d = np.asarray(Image.fromarray((d * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), dtype=np.float32) / 255.0
    rgb = np.asarray(img.convert("RGB"))
    out = []
    for lo, hi in ((0.42, 0.58), (0.68, 0.82)):
        a = (smoothstep(lo, hi, d) * 255).astype(np.uint8)
        out.append(Image.fromarray(np.dstack([rgb, a]), "RGBA"))
    return out


def main():
    manifest = json.loads((ROOT / (sys.argv[1] if len(sys.argv) > 1 else "assets/media.json")).read_text(encoding="utf-8"))
    pins = manifest.get("sha256", {})
    ART.mkdir(parents=True, exist_ok=True)
    GEO.mkdir(parents=True, exist_ok=True)

    session = None
    if any(a.get("depth") for a in manifest["art"]):
        import onnxruntime as ort
        model = get(manifest["depth_model"]["url"], "depth-anything-v2-small.onnx", pins)
        session = ort.InferenceSession(str(model), providers=["CPUExecutionProvider"])

    index = {}
    for a in manifest["art"]:
        if a["source"] == "commons":
            url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(a["file"])  # original file: arbitrary-width thumbnails are throttled
        else:
            url = livius_image(a["page"])
        src = get(url, f"{a['id']}.src", pins)
        img = Image.open(src)
        img.load()
        img = img.convert("RGB")
        img.thumbnail((2000, 2000), Image.LANCZOS)
        img.save(ART / f"{a['id']}.webp", quality=88)
        layers = 0
        if a.get("depth") and session is not None:
            for k, layer in enumerate(depth_layers(img, session), start=1):
                layer.save(ART / f"{a['id']}_l{k}.webp", quality=85)
            layers = 2
        index[a["id"]] = {"w": img.width, "h": img.height, "layers": layers, "credit": a["credit"]}
        print(f"ART {a['id']} {img.width}x{img.height} layers={layers}")
    (ART / "index.json").write_text(json.dumps(index, indent=1), encoding="utf-8")

    g = manifest["geo"]
    x0, y0, x1, y1 = g["bbox"]
    rivers = json.loads(get(g["rivers"], "ne_50m_rivers.geojson", pins).read_text(encoding="utf-8"))

    def inside(coords):
        return any(x0 <= c[0] <= x1 and y0 <= c[1] <= y1 for c in coords)

    feats = []
    for f in rivers["features"]:
        geom = f["geometry"]
        lines = geom["coordinates"] if geom["type"] == "MultiLineString" else [geom["coordinates"]]
        lines = [[[round(c[0], 3), round(c[1], 3)] for c in ln] for ln in lines if inside(ln)]
        if lines:
            feats.append({"type": "Feature", "properties": {"name": f["properties"].get("name") or ""}, "geometry": {"type": "MultiLineString", "coordinates": lines}})
    (GEO / "rivers.json").write_text(json.dumps({"type": "FeatureCollection", "features": feats}), encoding="utf-8")
    print(f"GEO rivers {len(feats)}")

    relief = None
    for i, url in enumerate(g["relief"]):
        try:
            relief = get(url, f"relief{i}.zip", pins)
            break
        except Exception as e:  # noqa: BLE001 — try the next mirror name
            print(f"relief {url}: {e}")
    if relief is None:
        raise SystemExit("no shaded relief download worked")
    with zipfile.ZipFile(relief) as z:
        tif = next(n for n in z.namelist() if n.lower().endswith(".tif"))
        full = Image.open(io.BytesIO(z.read(tif)))
        full.load()
    W, H = full.size  # whole world, equirectangular, -180..180 / 90..-90
    box = (int((x0 + 180) / 360 * W), int((90 - y1) / 180 * H), int((x1 + 180) / 360 * W), int((90 - y0) / 180 * H))
    crop = full.convert("L").crop(box)
    crop.save(GEO / "relief.webp", quality=90)
    (GEO / "relief.json").write_text(json.dumps({"bounds": [x0, y0, x1, y1], "w": crop.width, "h": crop.height}), encoding="utf-8")
    print(f"GEO relief {crop.width}x{crop.height}")


if __name__ == "__main__":
    main()
