const MAX_BUFFER = 24;
const MOTION_TIMEOUT = 45;

const DIR_MAP = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
  'down-left': 'down-left',
  'down-right': 'down-right'
};

/** Collapse motion history to cardinal steps (deduped). */
function toCardinals(history, facing) {
  const forward = facing === 1 ? 'right' : 'left';
  const back = facing === 1 ? 'left' : 'right';
  const downForward = facing === 1 ? 'down-right' : 'down-left';
  const cards = [];

  const push = (c) => {
    if (cards[cards.length - 1] !== c) cards.push(c);
  };

  for (const { dir } of history) {
    if (dir === 'down-left') {
      push('down');
      push(back);
    } else if (dir === 'down-right') {
      push('down');
      push(forward);
    } else if (dir === 'down') {
      push('down');
    } else if (dir === forward) {
      push(forward);
    } else if (dir === back) {
      push(back);
    } else if (dir === 'up') {
      push('up');
    }
  }
  return cards;
}

/** QCF: down before forward (diagonal counts). */
function hasQuarterCircle(cards, facing) {
  const forward = facing === 1 ? 'right' : 'left';
  let sawDown = false;
  for (const c of cards) {
    if (c === 'down') sawDown = true;
    if (sawDown && c === forward) return true;
  }
  return false;
}

/** Double QCF: two forward taps after separate down taps. */
function hasDoubleQuarterCircle(cards, facing) {
  const forward = facing === 1 ? 'right' : 'left';
  let qcfCount = 0;
  let sawDown = false;
  for (const c of cards) {
    if (c === 'down') sawDown = true;
    if (sawDown && c === forward) {
      qcfCount++;
      sawDown = false;
      if (qcfCount >= 2) return true;
    }
  }
  return false;
}

export class InputBuffer {
  constructor() {
    this.buffer = [];
    this.motionHistory = [];
    this.motionTimer = 0;
  }

  push(action, frame) {
    this.buffer.push({ action, frame });
    if (this.buffer.length > MAX_BUFFER) this.buffer.shift();

    if (DIR_MAP[action]) {
      this.motionHistory.push({ dir: action, frame });
      this.motionTimer = MOTION_TIMEOUT;
      if (this.motionHistory.length > 12) this.motionHistory.shift();
    }
  }

  tick() {
    if (this.motionTimer > 0) this.motionTimer--;
    else this.motionHistory = [];

    const now = this.buffer.length ? this.buffer[this.buffer.length - 1].frame : 0;
    this.buffer = this.buffer.filter((e) => now - e.frame <= MAX_BUFFER);
  }

  wasPressed(action, frames = 6) {
    if (!this.buffer.length) return false;
    const now = this.buffer[this.buffer.length - 1].frame;
    return this.buffer.some((e) => e.action === action && now - e.frame <= frames);
  }

  consume(action) {
    const idx = this.buffer.findIndex((e) => e.action === action);
    if (idx === -1) return false;
    this.buffer.splice(idx, 1);
    return true;
  }

  matchMotion(sequence, facing = 1) {
    if (this.motionTimer <= 0 || !this.motionHistory.length) return false;
    const cards = toCardinals(this.motionHistory, facing);

    if (sequence.length >= 6) {
      return hasDoubleQuarterCircle(cards, facing);
    }
    if (sequence.length >= 3) {
      return hasQuarterCircle(cards, facing);
    }
    return false;
  }

  clearMotion() {
    this.motionHistory = [];
    this.motionTimer = 0;
  }

  static mirrorSequence(sequence, facing) {
    if (facing === 1) return sequence;
    return sequence.map((d) => {
      if (d === 'right') return 'left';
      if (d === 'left') return 'right';
      if (d === 'down-right') return 'down-left';
      if (d === 'down-left') return 'down-right';
      return d;
    });
  }

  matchMotionForFacing(sequence, facing) {
    return this.matchMotion(sequence, facing);
  }
}

export function createKeyboard(scene) {
  const keys = scene.input.keyboard.addKeys({
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    punch: Phaser.Input.Keyboard.KeyCodes.J,
    kick: Phaser.Input.Keyboard.KeyCodes.K,
    altPunch: Phaser.Input.Keyboard.KeyCodes.Z,
    altKick: Phaser.Input.Keyboard.KeyCodes.X,
    leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
    rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
    downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN
  });

  return keys;
}

export function readPlayerInput(keys, buffer, frame) {
  const input = {
    left: keys.left.isDown || keys.leftArrow.isDown,
    right: keys.right.isDown || keys.rightArrow.isDown,
    up: keys.up.isDown || keys.upArrow.isDown,
    down: keys.down.isDown || keys.downArrow.isDown,
    punch: Phaser.Input.Keyboard.JustDown(keys.punch) || Phaser.Input.Keyboard.JustDown(keys.altPunch),
    kick: Phaser.Input.Keyboard.JustDown(keys.kick) || Phaser.Input.Keyboard.JustDown(keys.altKick),
    direction: 'neutral'
  };

  if (input.down && input.left) input.direction = 'down-left';
  else if (input.down && input.right) input.direction = 'down-right';
  else if (input.down) input.direction = 'down';
  else if (input.up) input.direction = 'up';
  else if (input.left) input.direction = 'left';
  else if (input.right) input.direction = 'right';

  if (input.direction !== 'neutral') buffer.push(input.direction, frame);
  if (input.punch) buffer.push('punch', frame);
  if (input.kick) buffer.push('kick', frame);

  return input;
}
