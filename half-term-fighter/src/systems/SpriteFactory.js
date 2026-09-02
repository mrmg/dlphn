/** Minimal pose set — each is its own 128×160 PNG, no sprite-sheet indices. */
export const POSE_NAMES = ['idle', 'walk', 'punch', 'kick', 'hit', 'special', 'super', 'knockdown'];

export function poseKey(charId, name) {
  return `${charId}-${name}`;
}

export function getPose(charId, name) {
  return poseKey(charId, name);
}

const ANIMS = {
  dad: {
    idle: ['idle', 'idle', 'idle', 'idle'],
    walk: ['walk', 'walk'],
    punch: ['punch'],
    kick: ['kick'],
    hit: ['hit', 'hit'],
    special: ['special'],
    super: ['super'],
    knockdown: ['knockdown']
  },
  kid: {
    idle: ['idle', 'idle', 'idle', 'idle'],
    walk: ['walk', 'walk'],
    punch: ['punch'],
    kick: ['kick'],
    hit: ['hit', 'hit'],
    special: ['special'],
    super: ['super'],
    knockdown: ['knockdown']
  }
};

export function registerAnimations(scene, charId) {
  const anims = ANIMS[charId];
  Object.entries(anims).forEach(([name, poseNames]) => {
    const key = `${charId}-${name}`;
    if (scene.anims.exists(key)) scene.anims.remove(key);
    scene.anims.create({
      key,
      frames: poseNames.map((p) => ({ key: poseKey(charId, p) })),
      frameRate: name === 'walk' ? 8 : name === 'idle' ? 4 : 1,
      repeat: ['idle', 'walk', 'block'].includes(name) ? -1 : 0
    });
  });
}

export function loadCharacterPoses(loader, charId, query = '') {
  const used = new Set(Object.values(ANIMS[charId]).flat());
  used.add('knockdown');
  used.add('hit');
  used.forEach((pose) => {
    loader.image(poseKey(charId, pose), `poses/${charId}-${pose}.png${query}`);
  });
}

export const FRAME_W = 128;
export const FRAME_H = 160;
