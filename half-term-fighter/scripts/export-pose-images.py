#!/usr/bin/env python3
"""Export each fighter pose as its own normalized PNG — no sprite-sheet frame bleed."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

FRAME_W, FRAME_H = 128, 160
FRAME_PAD_X = 6
FRAMES = 8
FEET_Y = 152
TARGET_BODY_H = 132  # lock silhouette height — stops pose-to-pose jumping

ROOT = Path(__file__).resolve().parent.parent
REF_DIR = ROOT.parent / 'public' / 'half-term-fighter' / 'assets'
OUT_DIRS = [
    ROOT.parent / 'public' / 'half-term-fighter' / 'assets' / 'poses',
    ROOT / 'assets' / 'poses',
]

# Frame order in the reference strip (left → right), per character.
# Frame indices verified against dad-ref.png / kid-ref.png strips (Jun 2026).
POSE_ORDER = {
    'dad': ['idle', 'walk', 'punch', 'kick', 'block', 'hit', 'special', 'knockdown'],
    # kid frame 6 = rainbow dash (super), frame 7 = star blast (special)
    'kid': ['idle', 'walk', 'punch', 'kick', 'knockdown', 'hit', 'super', 'special'],
}


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 40:
        return True
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
    scale = min(TARGET_BODY_H / th, inner_w / tw)
    nw = max(1, int(tw * scale))
    nh = max(1, int(th * scale))
    scaled = trimmed.resize((nw, nh), Image.Resampling.NEAREST)

    frame = Image.new('RGBA', (FRAME_W, FRAME_H), (0, 0, 0, 0))
    x = FRAME_PAD_X + (inner_w - nw) // 2
    y = FEET_Y - nh
    frame.paste(scaled, (x, y), scaled)
    return frame


def export_poses(name: str) -> None:
    ref_path = REF_DIR / f'{name}-ref.png'
    if not ref_path.exists():
        raise FileNotFoundError(f'Missing reference strip: {ref_path}')

    strip = Image.open(ref_path).convert('RGBA')
    slice_w = strip.width // FRAMES
    order = POSE_ORDER[name]

    for dest_dir in OUT_DIRS:
        dest_dir.mkdir(parents=True, exist_ok=True)

    # Kid strip has no block frame — reuse idle.
    if name == 'kid':
        order = list(order)
        if 'block' not in order:
            pass  # block copied after loop

    for i, pose in enumerate(order):
        x0 = i * slice_w
        x1 = (i + 1) * slice_w if i < FRAMES - 1 else strip.width
        frame = extract_frame(strip, x0, x1)
        for dest_dir in OUT_DIRS:
            out = dest_dir / f'{name}-{pose}.png'
            frame.save(out, optimize=True)
            print(f'wrote {out}')

    if name == 'kid':
        idle_path = OUT_DIRS[0] / 'kid-idle.png'
        for dest_dir in OUT_DIRS:
            out = dest_dir / 'kid-block.png'
            Image.open(idle_path).save(out, optimize=True)
            print(f'wrote {out} (from idle)')

    # Dad strip has no dedicated super — punch frame + golden energy overlay.
    if name == 'dad' and 'super' not in order:
        punch_path = OUT_DIRS[0] / 'dad-punch.png'
        super_im = Image.open(punch_path).convert('RGBA')
        px = super_im.load()
        for y in range(super_im.height):
            for x in range(super_im.width):
                r, g, b, a = px[x, y]
                if a > 0:
                    px[x, y] = (min(255, r + 55), min(255, g + 35), max(0, b - 20), a)
                elif 40 < y < 130 and 20 < x < 108:
                    # faint caffeine aura behind the fighter
                    if ((x + y) % 11) < 4:
                        px[x, y] = (255, 200, 60, 40)
        for dest_dir in OUT_DIRS:
            out = dest_dir / 'dad-super.png'
            super_im.save(out, optimize=True)
            print(f'wrote {out} (from punch + caffeine aura)')


if __name__ == '__main__':
    for char in ('dad', 'kid'):
        export_poses(char)
