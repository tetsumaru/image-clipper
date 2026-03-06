import os
import json
from pathlib import Path

IMG_DIR = Path(os.getenv("IMG_DIR", "~/imageclipper")).expanduser()

EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif",
    ".heic", ".tif", ".tiff",
    ".webp", ".bmp",
}

items = []

if not IMG_DIR.exists():
    items = [{
        "title": "Directory does not exist",
        "subtitle": str(IMG_DIR),
        "valid": False,
    }]
else:
    files = [
        p for p in IMG_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in EXTENSIONS
    ]

    files.sort(key=lambda p: p.stat().st_mtime, reverse=True)

    for p in files[:200]:
        items.append({
            "title": p.name,
            "subtitle": str(p),
            "arg": str(p),
            "icon": {"path": str(p)},
            "quicklookurl": p.as_uri(),
        })

if not items:
    items = [{
        "title": "No images found in directory",
        "subtitle": str(IMG_DIR),
        "valid": False,
    }]

print(json.dumps({"items": items}))
