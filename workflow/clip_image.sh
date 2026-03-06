#!/bin/bash
set -euo pipefail

p="${1:-}"

if [[ -z "$p" ]]; then
    echo "No input file path specified." >&2
    exit 1
fi

if [[ ! -f "$p" ]]; then
    echo "File not found: $p" >&2
    exit 1
fi

tmp="$(mktemp -t alfred_imgclip_XXXXXX).png"
trap 'rm -f "$tmp"' EXIT

/usr/bin/sips -s format png "$p" --out "$tmp" >/dev/null

/usr/bin/osascript <<OSA
set f to POSIX file "$tmp"
set the clipboard to (read f as «class PNGf»)
OSA
