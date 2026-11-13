"""Download + verify + unpack assets from the assets Release (CI and local).

Usage: python tools/fetch_assets.py [name-substring ...]   (no args = all)
Uses `gh release download` when available (works for public repos without a token too via the URL).
"""

import hashlib
import json
import sys
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / "assets" / "manifest.json").read_text())
want = sys.argv[1:]
cache = ROOT / ".cache" / "assets"
cache.mkdir(parents=True, exist_ok=True)

for f in manifest["files"]:
    if want and not any(w in f["name"] for w in want):
        continue
    dest = ROOT / f["dest"]
    marker = dest / f".{f['sha256'][:12]}"
    if marker.exists():
        print(f"ok (cached) {f['name']}")
        continue
    zpath = cache / f["name"]
    if not zpath.exists() or hashlib.sha256(zpath.read_bytes()).hexdigest() != f["sha256"]:
        url = f"https://github.com/{manifest['repo']}/releases/download/{manifest['release']}/{f['name']}"
        print(f"download {url}")
        urllib.request.urlretrieve(url, zpath)
    digest = hashlib.sha256(zpath.read_bytes()).hexdigest()
    if digest != f["sha256"]:
        sys.exit(f"SHA256 mismatch for {f['name']}: {digest}")
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zpath) as z:
        for member in z.namelist():
            if member.startswith("/") or ".." in Path(member).parts:
                sys.exit(f"unsafe path in {f['name']}: {member}")
        z.extractall(dest)
    marker.touch()
    print(f"ok {f['name']} -> {f['dest']}")
