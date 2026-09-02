#!/usr/bin/env python3
"""Build uniform fighter sprite sheets from reference strips."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

FRAME_W, FRAME_H = 128, 160
# Inset content so adjacent strip poses don't bleed into Phaser frame cells.
FRAME_PAD_X = 6
FRAMES = 8
FEET_Y = 152

ROOT = Path(__file__).resolve().parent.parent
REF_DIR = ROOT.parent / 'public' / 'half-term-fighter' / 'assets'
OUT_DIRS = [
    ROOT / 'assets',
    ROOT.parent / 'public' / 'half-term-fighter' / 'assets',
]


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 40:
        return True
    # Baked-in light checkerboard from image gen exports
    if abs(r - g) < 15 and abs(g - b) < 15 and r > 150:
        return True
    return False


def extract_frame(strip: Image.Image, x0: int, x1: int) -> Image.Image:
    col = strip.crop((x0, 0, x1, strip.height)).convert('RGBA')
    px = col.load()
    w, h = col.size

    cleaned = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not is_background(r, g, b, a):
                cleaned.putpixel((x, y), (r, g, b, 255))

    bbox = cleaned.getbbox()
    if not bbox:
        raise ValueError(f'Empty frame slice ({x0}, {x1})')

    trimmed = cleaned.crop(bbox)
    tw, th = trimmed.size
    inner_w = FRAME_W - FRAME_PAD_X * 2
    target_h = FRAME_H - 12
    scale = min(target_h / th, inner_w / tw)
    nw = max(1, int(tw * scale))
    nh = max(1, int(th * scale))
    scaled = trimmed.resize((nw, nh), Image.Resampling.NEAREST)

    frame = Image.new('RGBA', (FRAME_W, FRAME_H), (0, 0, 0, 0))
    x = FRAME_PAD_X + (inner_w - nw) // 2
    y = FEET_Y - nh
    frame.paste(scaled, (x, y), scaled)
    return frame


def build_sheet(name: str) -> None:
    ref_path = REF_DIR / f'{name}-ref.png'
    if not ref_path.exists():
        raise FileNotFoundError(f'Missing reference strip: {ref_path}')

    strip = Image.open(ref_path).convert('RGBA')
    slice_w = strip.width // FRAMES
    sheet = Image.new('RGBA', (FRAME_W * FRAMES, FRAME_H), (0, 0, 0, 0))

    for i in range(FRAMES):
        x0 = i * slice_w
        x1 = (i + 1) * slice_w if i < FRAMES - 1 else strip.width
        frame = extract_frame(strip, x0, x1)
        sheet.paste(frame, (i * FRAME_W, 0))

    for dest_dir in OUT_DIRS:
        dest_dir.mkdir(parents=True, exist_ok=True)
        out = dest_dir / f'{name}-sheet.png'
        sheet.save(out, optimize=True)
        print(f'wrote {out} ({sheet.size[0]}x{sheet.size[1]})')


if __name__ == '__main__':
    build_sheet('dad')
    build_sheet('kid')
