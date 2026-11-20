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
        time.sleep(0.3 if name.endswith('.tile') else 4)  # pace requests (map tiles are small and served by a CDN)
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
        out.append(Image.fromarray(np.dstack([rgb, a])))
    return out


U2NET_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx"  # U-2-Net weights, Apache-2.0


def cutout(img, session):
    """Remove the background (U-2-Net salient-object mask), crop to the object: landmarks / animals placed at exact scale."""
    w, h = img.size
    x = np.asarray(img.convert("RGB").resize((320, 320), Image.LANCZOS), dtype=np.float32) / 255.0
    x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
    m = session.run(None, {session.get_inputs()[0].name: x.transpose(2, 0, 1)[None]})[0][0, 0]
    m = (m - m.min()) / max(1e-6, m.max() - m.min())
    a = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((w, h), Image.LANCZOS), dtype=np.float32)
    a = np.clip((a - 40) * (255 / 175), 0, 255).astype(np.uint8)  # firm edge, no grey halo
    rgba = Image.fromarray(np.dstack([np.asarray(img.convert("RGB")), a]))
    ys, xs = np.nonzero(a > 24)
    if len(xs) == 0:
        raise SystemExit("cutout found no object")
    return rgba.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def tile_mosaic(a, pins):
    """Stitch a Web-Mercator XYZ tile grid (licence-checked imagery, e.g. Sentinel-2 cloudless 2016) centred on
    `center` [lon, lat] at zoom `z`, `grid` [cols, rows] tiles of 256 px. Returns (image, metres per pixel at centre).
    Scale & Science satellite zooms place footprints in metres on top of it (SatZoom)."""
    import math
    lon, lat = a["center"]
    z = int(a["z"])
    n = 2 ** z
    fx = (lon + 180) / 360 * n
    fy = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    cols, rows = a["grid"]
    tx0, ty0 = int(fx - cols / 2), int(fy - rows / 2)
    ts = a.get("tile", 256)
    img = Image.new("RGB", (cols * ts, rows * ts))
    for j in range(rows):
        for i in range(cols):
            x, y = (tx0 + i) % n, ty0 + j
            url = a["template"].format(z=z, x=x, y=y)
            path = get(url, f"{a['id']}_{z}_{x}_{y}.tile", pins)
            img.paste(Image.open(path).convert("RGB").resize((ts, ts)), (i * ts, j * ts))
    # crop so the requested centre is the image centre
    cx, cy = (fx - tx0) * ts, (fy - ty0) * ts
    half_w, half_h = min(cx, cols * ts - cx), min(cy, rows * ts - cy)
    img = img.crop((int(cx - half_w), int(cy - half_h), int(cx + half_w), int(cy + half_h)))
    mpp = 156543.03392 * math.cos(math.radians(lat)) / n * (256 / ts)
    return img, mpp


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

    cut_session = None
    if any(a.get("cutout") for a in manifest["art"]):
        import onnxruntime as ort
        cut_session = ort.InferenceSession(str(get(U2NET_URL, "u2net.onnx", pins)), providers=["CPUExecutionProvider"])

    # Incremental build: CI seeds public/ from the newest media release, so only new ids are downloaded
    # (re-fetching ~90 Wikimedia originals from one runner IP gets HTTP 429). MEDIA_FULL=1 forces a full rebuild.
    import os
    old = {}
    if (ART / "index.json").exists() and os.environ.get("MEDIA_FULL") != "1":
        old = json.loads((ART / "index.json").read_text(encoding="utf-8"))
    index = {}
    for a in manifest["art"]:
        if a["id"] in old and (ART / f"{a['id']}.webp").exists():
            index[a["id"]] = old[a["id"]]
            print(f"KEEP {a['id']}")
            continue
        if a["source"] == "commons":
            url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(a["file"])  # original file: arbitrary-width thumbnails are throttled
        elif a["source"] == "artic":  # Art Institute of Chicago open access (CC0): API -> IIIF image
            req = urllib.request.Request(f"https://api.artic.edu/api/v1/artworks/{a['artwork']}?fields=image_id", headers=UA)
            image_id = json.loads(urllib.request.urlopen(req, timeout=60).read())["data"]["image_id"]
            url = f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg"
        elif a["source"] == "tiles":
            img, mpp = tile_mosaic(a, pins)
            big = max(img.size)
            img.thumbnail((a.get("max", 2400), a.get("max", 2400)), Image.LANCZOS)
            mpp *= big / max(img.size)
            img.save(ART / f"{a['id']}.webp", quality=90)
            index[a["id"]] = {"w": img.width, "h": img.height, "layers": 0, "credit": a["credit"], "mpp": round(mpp, 4), "center": a["center"]}
            print(f"SAT {a['id']} {img.width}x{img.height} {mpp:.2f} m/px")
            continue
        elif a["source"] == "url":
            url = a["url"]
        else:
            url = livius_image(a["page"])
        src = get(url, f"{a.get('src', a['id'])}.src", pins)  # "src": share one download between several crops
        img = Image.open(src)
        if a.get("crop"):  # normalised [x0, y0, x1, y1] window of a huge original (e.g. NASA Black Marble, 43200 px)
            W, H = img.size
            x0, y0, x1, y1 = a["crop"]
            img = img.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
        img.load()
        img = img.convert("RGB")
        img.thumbnail((a.get("max", 2000), a.get("max", 2000)), Image.LANCZOS)
        if a.get("gamma"):  # lift very dark sources (NASA night lights) so they read on a phone: out = in ** (1 / gamma)
            arr = np.asarray(img, dtype=np.float32) / 255.0
            img = Image.fromarray((np.clip(arr ** (1.0 / float(a["gamma"])), 0, 1) * 255).astype(np.uint8))
        if a.get("rotate"):  # degrees counter-clockwise (e.g. a diagonal top-view whale made horizontal before the cut-out)
            img = img.rotate(float(a["rotate"]), resample=Image.BICUBIC, expand=True, fillcolor=tuple(a.get("fill", [0, 0, 0])))
        if a.get("cutout"):
            img = cutout(img, cut_session)
            img.save(ART / f"{a['id']}.webp", quality=90)  # RGBA, cropped to the object
            index[a["id"]] = {"w": img.width, "h": img.height, "layers": 0, "credit": a["credit"], "cutout": True}
            print(f"CUT {a['id']} {img.width}x{img.height}")
            continue
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
    print(f"GEO rivers {len(feats)}: " + ", ".join(sorted({f["properties"]["name"] for f in feats if f["properties"]["name"]})))

    # Money & Maps 003: admin-1 regions (Natural Earth 10m, public domain) for regional choropleths -> public/geo/admin1.json
    if g.get("admin1"):
        a1 = g["admin1"]
        src = json.loads(get(a1["url"], "ne_10m_admin1.geojson", pins).read_text(encoding="utf-8"))
        keep, nd = set(a1["countries"]), a1.get("round", 3)

        def rnd(c):
            if isinstance(c[0], (int, float)):
                return [round(c[0], nd), round(c[1], nd)]
            out = [rnd(x) for x in c]
            if out and isinstance(out[0][0], (int, float)):  # a ring: drop repeated points after rounding
                out = [pt for i, pt in enumerate(out) if i == 0 or pt != out[i - 1]]
            return out

        feats = [{"type": "Feature", "properties": {"id": f["properties"].get("iso_3166_2"), "name": f["properties"].get("name"), "adm0": f["properties"].get("adm0_a3")},
                  "geometry": {"type": f["geometry"]["type"], "coordinates": rnd(f["geometry"]["coordinates"])}}
                 for f in src["features"] if f["properties"].get("adm0_a3") in keep and f.get("geometry")]
        (GEO / "admin1.json").write_text(json.dumps({"type": "FeatureCollection", "features": feats}, separators=(",", ":")), encoding="utf-8")
        print(f"GEO admin1 {len(feats)} regions: " + ", ".join(sorted(keep)))
        # exact shared boundaries between two groups of regions (e.g. the former inner German border = old/new Länder edge)
        lines = {}
        def rings(f):
            gm = f["geometry"]
            polys = [gm["coordinates"]] if gm["type"] == "Polygon" else gm["coordinates"]
            return [r for poly in polys for r in poly]
        def edges(ids):
            out = set()
            for f in feats:
                if f["properties"]["id"] in ids:
                    for r in rings(f):
                        for i in range(len(r) - 1):
                            out.add((tuple(r[i]), tuple(r[i + 1])))
            return out
        for b in a1.get("borders", []):
            ea, eb = edges(set(b["a"])), edges(set(b["b"]))
            seg = [e for e in ea if e in eb or (e[1], e[0]) in eb]
            nxt = {}
            for u, v in seg:
                nxt.setdefault(u, []).append(v)
                nxt.setdefault(v, []).append(u)
            used, chains = set(), []
            starts = [n for n, vs in nxt.items() if len(vs) == 1] + list(nxt)
            for st in starts:
                for v0 in nxt[st]:
                    if (st, v0) in used:
                        continue
                    ch, u, v = [st], st, v0
                    while True:
                        used.add((u, v)); used.add((v, u)); ch.append(v)
                        cand = [w for w in nxt[v] if (v, w) not in used]
                        if len(nxt[v]) != 2 or not cand:
                            break
                        u, v = v, cand[0]
                    chains.append([list(c) for c in ch])
            lines[b["name"]] = [c for c in chains if len(c) > 2]
            print(f"GEO border {b['name']}: {len(seg)} segments -> {len(lines[b['name']])} lines")
        (GEO / "lines.json").write_text(json.dumps(lines, separators=(",", ":")), encoding="utf-8")
    # extra geo files copied as-is (e.g. us-atlas counties TopoJSON, ISC package of US Census public-domain data)
    for x in g.get("extra", []):
        (GEO / x["name"]).write_bytes(get(x["url"], x["name"], pins).read_bytes())
        print(f"GEO extra {x['name']}")

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
    # shade only: flat terrain (>= 75th percentile) becomes white, so 'multiply' leaves no visible raster edge
    arr = np.asarray(crop, dtype=np.float32)
    hi = float(np.percentile(arr, 75))
    crop = Image.fromarray(np.clip(arr / max(1.0, hi) * 255, 0, 255).astype(np.uint8))
    crop.save(GEO / "relief.webp", quality=90)
    (GEO / "relief.json").write_text(json.dumps({"bounds": [x0, y0, x1, y1], "w": crop.width, "h": crop.height}), encoding="utf-8")
    print(f"GEO relief {crop.width}x{crop.height}")


if __name__ == "__main__":
    main()
