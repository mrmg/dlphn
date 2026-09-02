#!/usr/bin/env python3
"""Repack fighter sprite sheets: feet on bottom row, centered, 96x128 frames."""
from pathlib import Path

from PIL import Image

FRAME_W, FRAME_H = 96, 128
FRAMES = 8
ASSETS = Path(__file__).resolve().parent.parent / 'assets'
PUBLIC = Path(__file__).resolve().parent.parent.parent / 'public' / 'half-term-fighter' / 'assets'


def normalize_sheet(name: str) -> None:
    src = ASSETS / f'{name}-sheet.png'
    im = Image.open(src).convert('RGBA')
    out = Image.new('RGBA', (FRAME_W * FRAMES, FRAME_H), (0, 0, 0, 0))
    feet_y = 118  # baseline for all poses

    for i in range(FRAMES):
        col = im.crop((i * FRAME_W, 0, (i + 1) * FRAME_W, FRAME_H))
        bbox = col.getbbox()
        if not bbox:
            continue
        trimmed = col.crop(bbox)
        tw, th = trimmed.size
        target_h = 104
        scale = min(target_h / th, (FRAME_W - 10) / tw, 3.5)
        nw = max(1, int(tw * scale))
        nh = max(1, int(th * scale))
        scaled = trimmed.resize((nw, nh), Image.Resampling.NEAREST)
        x = (FRAME_W - nw) // 2
        y = feet_y - nh
        frame = Image.new('RGBA', (FRAME_W, FRAME_H), (0, 0, 0, 0))
        frame.paste(scaled, (x, y), scaled)
        out.paste(frame, (i * FRAME_W, 0))

    for dest in (src, PUBLIC / f'{name}-sheet.png'):
        dest.parent.mkdir(parents=True, exist_ok=True)
        out.save(dest, optimize=True)
        print(f'wrote {dest} ({out.size[0]}x{out.size[1]})')


if __name__ == '__main__':
    for char in ('dad', 'kid'):
        normalize_sheet(char)
