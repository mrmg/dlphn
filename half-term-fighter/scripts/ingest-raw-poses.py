#!/usr/bin/env python3
"""Process individually generated pose PNGs into game frames."""
from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets' / 'raw-poses'
OUT_DIRS = [
    ROOT / 'assets' / 'poses',
    ROOT.parent / 'public' / 'half-term-fighter' / 'assets' / 'poses',
]

_spec = importlib.util.spec_from_file_location(
    'normalize_standalone_pose',
    Path(__file__).resolve().parent / 'normalize-standalone-pose.py'
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
normalize_pose = _mod.normalize_pose


def main() -> None:
    if not RAW.exists():
        print(f'No raw poses in {RAW}')
        return
    for src in sorted(RAW.glob('*.png')):
        name = src.stem
        for dest_dir in OUT_DIRS:
            normalize_pose(src, dest_dir / f'{name}.png')


if __name__ == '__main__':
    main()
