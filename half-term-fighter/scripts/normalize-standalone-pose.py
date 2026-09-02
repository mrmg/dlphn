#!/usr/bin/env python3
"""Normalize a single pose PNG into the game's 128×160 frame (feet aligned)."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

FRAME_W, FRAME_H = 128, 160
FRAME_PAD_X = 6
FEET_Y = 152
TARGET_BODY_H = 132  # consistent silhouette height across all poses


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 40:
        return True
    if abs(r - g) < 15 and abs(g - b) < 15 and r > 150:
        return True
    return False


def normalize_pose(src: Path, dest: Path) -> None:
    im = Image.open(src).convert('RGBA')
    px = im.load()
    w, h = im.size

    cleaned = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not is_background(r, g, b, a):
                cleaned.putpixel((x, y), (r, g, b, 255))

    bbox = cleaned.getbbox()
    if not bbox:
        raise ValueError(f'No visible pixels in {src}')

    trimmed = cleaned.crop(bbox)
    tw, th = trimmed.size
    inner_w = FRAME_W - FRAME_PAD_X * 2
    scale = min(TARGET_BODY_H / th, inner_w / tw)
    nw = max(1, int(tw * scale))
    nh = max(1, int(th * scale))
    scaled = trimmed.resize((nw, nh), Image.Resampling.NEAREST)

    frame = Image.new('RGBA', (FRAME_W, FRAME_H), (0, 0, 0, 0))
    x = FRAME_PAD_X + (inner_w - nw) // 2
    y = FEET_Y - nh
    frame.paste(scaled, (x, y), scaled)

    dest.parent.mkdir(parents=True, exist_ok=True)
    frame.save(dest, optimize=True)
    print(f'wrote {dest} ({nw}x{nh} in frame)')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('usage: normalize-standalone-pose.py <src.png> <dest.png>')
        sys.exit(1)
    normalize_pose(Path(sys.argv[1]), Path(sys.argv[2]))
