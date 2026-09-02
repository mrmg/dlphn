import { CHARACTERS, MOVES, GAME } from '../systems/CombatData.js';
import { getPose } from '../systems/SpriteFactory.js';

const STATE = {
  IDLE: 'idle',
  WALK: 'walk',
  JUMP: 'jump',
  ATTACK: 'attack',
  HIT: 'hit',
  KNOCKDOWN: 'knockdown',
  WIN: 'win',
  LOSE: 'lose'
};

const ATTACK_ANIM = {
  lightPunch: 'punch',
  lightKick: 'kick',
  jumpKick: 'kick',
  specialPunch: 'special',
  specialKick: 'kick',
  super: 'super'
};

export class Fighter {
  constructor(scene, x, charId, isPlayer, facing) {
    this.scene = scene;
    this.charId = charId;
    this.data = CHARACTERS[charId];
    this.isPlayer = isPlayer;
    this.facing = facing;
    this.opponent = null;

    this.scale = this.data.spriteScale ?? 2.55;

    this.sprite = scene.physics.add.sprite(x, GAME.GROUND_Y, getPose(charId, 'idle'));
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setScale(this.scale);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setAllowGravity(true);
    this.sprite.body.setSize(46, 98);
    this.sprite.body.setOffset(41, 58);
    this.sprite.setDepth(10);
    this.applyFacingFlip();

    this.maxHealth = this.data.maxHealth;
    this.health = this.maxHealth;
    this.meter = 0;
    this.maxMeter = 100;

    this.state = STATE.IDLE;
    this.currentMove = null;
    this.moveFrame = 0;
    this.hitstun = 0;
    this.hitStateFrames = 0;
    this.invuln = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.hitsThisMove = 0;
    this.knockdownTimer = 0;
    this.jumpGraceFrames = 0;
    this.lastHitFrame = -999;
    this.specialCooldown = 0;
    this.queuedMove = null;
    this.attackPoseLocked = false;
    this.projectilesSpawned = 0;

    this.setMovementPose('idle');
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  get body() { return this.sprite.body; }
  get isAlive() { return this.health > 0; }

  get isGrounded() {
    if (this.jumpGraceFrames > 0) return false;
    return Math.abs(this.y - GAME.GROUND_Y) <= 6 && this.body.velocity.y >= -40;
  }

  get isBusy() {
    if (this.state === STATE.HIT && this.hitstun <= 0 && this.knockdownTimer <= 0) {
      return false;
    }
    return [STATE.ATTACK, STATE.HIT, STATE.KNOCKDOWN, STATE.WIN, STATE.LOSE].includes(this.state);
  }

  applyFacingFlip() {
    this.sprite.setFlipX(this.facing === -1);
  }

  updateFacing(opponent) {
    if (!opponent) return;
    const toward = opponent.x >= this.x ? 1 : -1;
    if (toward !== this.facing) {
      this.facing = toward;
      this.applyFacingFlip();
    }
  }

  setMovementPose(poseName) {
    if (this.state === STATE.ATTACK || this.attackPoseLocked) return;
    const key = `${this.charId}-${poseName}`;
    if (this.sprite.anims.currentAnim?.key === key && this.sprite.anims.isPlaying) return;
    if (this.scene.anims.exists(key)) {
      this.sprite.anims.play(key, true);
    } else {
      this.sprite.anims.stop();
      this.sprite.setTexture(getPose(this.charId, poseName));
    }
  }

  lockAttackPose(moveId) {
    this.attackPoseLocked = true;
    this.sprite.anims.stop();
    this.sprite.setTexture(getPose(this.charId, ATTACK_ANIM[moveId] ?? 'punch'));
  }

  distanceTo(opponent) {
    return opponent ? Math.abs(this.x - opponent.x) : 999;
  }

  lungeToward(opponent, move) {
    if (!opponent || !this.isGrounded) return;
    const dx = opponent.x - this.x;
    const dist = Math.abs(dx);
    const reach = (move.reach ?? GAME.AUTO_LUNGE_GAP) * (this.scale / 2.55);
    if (move.spawnsProjectile && !move.reach) return;
    if (dist <= reach * 0.85) return;

    const targetGap = 78;
    const want = Math.max(0, dist - targetGap);
    const step = move.type === 'super' ? 280 : move.type === 'special' ? 180 : 140;
    const moveX = Math.sign(dx) * Math.min(want, step);
    this.sprite.x += moveX;
    this.body.setVelocityX(moveX > 0 ? 80 : -80);
  }

  queueMove(moveId) {
    this.queuedMove = moveId;
  }

  tryConsumeQueuedMove() {
    if (!this.queuedMove || this.isBusy) return false;
    const id = this.queuedMove;
    this.queuedMove = null;
    return this.tryStartMove(id, this.opponent);
  }

  tryStartMove(moveId, opponent = null) {
    if (!this.isAlive || this.isBusy) {
      if (this.isPlayer && moveId) this.queueMove(moveId);
      return false;
    }
    const move = MOVES[moveId];
    if (!move) return false;
    if (move.meterCost && this.meter < move.meterCost) return false;
    if ((move.type === 'special' || move.type === 'super') && this.specialCooldown > 0) return false;

    if (move.meterCost) this.meter = 0;
    if (move.type === 'special' || move.type === 'super') {
      this.specialCooldown = move.type === 'super' ? 70 : 28;
    }

    const foe = opponent || this.opponent;
    this.lungeToward(foe, move);

    this.state = STATE.ATTACK;
    this.currentMove = { ...move, id: moveId };
    this.moveFrame = 0;
    this.hitsThisMove = 0;
    this.lastHitFrame = -999;
    this.projectilesSpawned = 0;
    this.attackPoseLocked = true;
    this.lockAttackPose(moveId);
    this.body.setVelocityX(0);

    if (move.invulnStartup) {
      this.invuln = move.invulnStartup;
    }

    if (move.type === 'super') {
      this.body.setVelocityX(this.facing * (move.dashSpeed ?? 320));
      this.scene.onSuperStarted?.(this);
    } else if (move.type === 'special') {
      this.scene.onSpecialStarted?.(this, moveId);
      if (move.slideSpeed && this.isGrounded) {
        this.body.setVelocityX(this.facing * move.slideSpeed);
      }
    }
    return true;
  }

  /** Hitstun / knockdown ticks even when isBusy — CPU skips applyInput while hit, so this must run from the scene loop. */
  tickHitRecovery() {
    if (this.state === STATE.HIT && this.hitstun <= 0 && this.knockdownTimer <= 0) {
      this.recoverFromHit();
      return;
    }

    if (this.knockdownTimer > 0) {
      this.knockdownTimer--;
      if (this.knockdownTimer <= 0) {
        this.state = STATE.IDLE;
        this.hitstun = 0;
        this.attackPoseLocked = false;
        this.body.setVelocityX(this.body.velocity.x * 0.82);
        this.setMovementPose('idle');
      }
      return;
    }

    if (this.state === STATE.HIT || this.state === STATE.KNOCKDOWN) {
      this.hitStateFrames++;
    }

    if (this.hitstun > 0) this.hitstun--;

    if (this.state === STATE.HIT && (this.hitstun <= 0 || this.hitStateFrames > this.hitstun + 24)) {
      this.recoverFromHit();
    }

    // Safety — stale hitstun with idle state blocks movement forever otherwise.
    if (this.state === STATE.IDLE && this.hitstun > 0) {
      this.hitstun = 0;
    }
  }

  recoverFromHit() {
    this.state = STATE.IDLE;
    this.hitstun = 0;
    this.hitStateFrames = 0;
    this.attackPoseLocked = false;
    this.body.setVelocityX(this.body.velocity.x * 0.82);
    this.setMovementPose('idle');
  }

  applyInput(input) {
    if (!this.isAlive) return;

    if (this.state === STATE.HIT && this.hitstun <= 0) {
      this.recoverFromHit();
    }

    if (this.state === STATE.HIT || this.state === STATE.KNOCKDOWN || this.knockdownTimer > 0) return;
    if (this.state === STATE.ATTACK) return;

    if (input.up && this.isGrounded) {
      this.state = STATE.JUMP;
      this.jumpGraceFrames = 14;
      this.body.checkCollision.down = false;
      this.body.setVelocityY(this.data.jumpVelocity);
      const drift = (input.left ? -1 : input.right ? 1 : 0) * this.data.walkSpeed * 0.55;
      this.body.setVelocityX(drift);
      this.setMovementPose('idle');
      return;
    }

    if ((input.left || input.right) && this.isGrounded) {
      this.body.setVelocityX(input.left ? -this.data.walkSpeed : this.data.walkSpeed);
      this.state = STATE.WALK;
      this.setMovementPose('walk');
    } else if ((input.left || input.right) && !this.isGrounded) {
      this.body.setVelocityX(input.left ? -this.data.walkSpeed * 0.6 : this.data.walkSpeed * 0.6);
      this.state = STATE.JUMP;
    } else if (!this.isGrounded) {
      this.body.setVelocityX(this.body.velocity.x * 0.94);
      this.state = STATE.JUMP;
    } else {
      this.body.setVelocityX(0);
      this.state = STATE.IDLE;
      this.setMovementPose('idle');
    }
  }

  isInActiveFrames() {
    if (this.state !== STATE.ATTACK || !this.currentMove) return false;
    const m = this.currentMove;
    const f = this.moveFrame;
    return f >= m.startup + 1 && f <= m.startup + m.active;
  }

  updateAttack() {
    if (this.state !== STATE.ATTACK || !this.currentMove) return false;

    this.moveFrame++;
    const m = this.currentMove;
    const total = m.startup + m.active + m.recovery;

    this.trySpawnProjectiles();

    if (this.moveFrame > total) {
      this.state = STATE.IDLE;
      this.currentMove = null;
      this.attackPoseLocked = false;
      this.body.setVelocityX(0);
      this.setMovementPose('idle');
      this.tryConsumeQueuedMove();
      return false;
    }

    if (m.type === 'super' && this.moveFrame <= m.startup + m.active) {
      this.body.setVelocityX(this.facing * (m.dashSpeed ?? 320) * 0.92);
    } else if (m.slideSpeed && this.moveFrame <= m.startup + m.active) {
      this.body.setVelocityX(this.facing * m.slideSpeed * 0.88);
    } else if (this.moveFrame <= m.startup + m.active) {
      this.body.setVelocityX(this.body.velocity.x * 0.9);
    } else {
      this.body.setVelocityX(0);
    }

    if (m.spawnsProjectile) return false;

    const hitCooldown = m.type === 'super' ? 3 : m.type === 'special' ? 5 : 999;
    if (!this.isInActiveFrames()) return false;
    if (this.hitsThisMove >= (m.maxHits || 1)) return false;
    if (this.moveFrame - this.lastHitFrame < hitCooldown) return false;

    const foe = this.opponent;
    if (!foe) return false;
    const reach = (m.reach ?? 100) * (this.scale / 2.55);
    if (this.distanceTo(foe) > reach) return false;

    return true;
  }

  trySpawnProjectiles() {
    const m = this.currentMove;
    if (!m?.spawnsProjectile || !this.scene.spawnProjectile) return;

    const burst = m.projectileBurst ?? 1;
    const interval = m.projectileInterval ?? 0;
    const firstAt = m.projectileAt ?? 10;

    for (let i = this.projectilesSpawned; i < burst; i++) {
      const at = firstAt + i * interval;
      if (this.moveFrame >= at) {
        this.scene.spawnProjectile(this, m.id, i);
        this.projectilesSpawned++;
      }
    }
  }

  tickCooldowns() {
    if (this.specialCooldown > 0) this.specialCooldown--;
    if (this.invuln > 0) this.invuln--;
  }

  tickJumpGrace() {
    if (this.jumpGraceFrames > 0) {
      this.jumpGraceFrames--;
      if (this.jumpGraceFrames <= 0) {
        this.body.checkCollision.down = true;
      }
    }
  }

  snapToGround() {
    if (this.jumpGraceFrames > 0) return;
    if (this.y >= GAME.GROUND_Y - 2 && this.body.velocity.y >= 0) {
      this.sprite.y = GAME.GROUND_Y;
      if (this.body.velocity.y > 0) this.body.setVelocityY(0);
      if (this.state === STATE.JUMP) {
        this.state = STATE.IDLE;
        this.setMovementPose('idle');
      }
    }
  }

  calcDamage(move) {
    const map = {
      lightPunch: 'punchDamage',
      lightKick: 'kickDamage',
      jumpKick: 'kickDamage',
      specialPunch: 'specialDamage',
      specialKick: 'specialDamage',
      super: 'superDamage'
    };
    const key = map[move.id] || 'punchDamage';
    return Math.round(this.data.stats[key] * (move.damage || 1));
  }

  receiveHit(attacker, damage, move) {
    if (this.invuln > 0 || !this.isAlive) return { type: 'whiff' };
    // Re-hits during hitstun reset the timer forever — supers are the only exception.
    if ((this.state === STATE.HIT || this.state === STATE.KNOCKDOWN) && this.hitstun > 0) {
      if (move.type !== 'super') return { type: 'whiff' };
    }

    this.health = Math.max(0, this.health - damage);
    this.hitstun = move.hitstun;
    this.hitStateFrames = 0;
    this.state = STATE.HIT;
    this.currentMove = null;
    this.attackPoseLocked = false;
    const kbScale = move.type === 'super' ? 0.65 : move.type === 'special' ? 0.42 : 0.28;
    this.body.setVelocityX(-this.facing * move.knockback * kbScale);
    this.body.setVelocityY(move.type === 'super' ? -160 : move.type === 'special' ? -65 : -35);
    this.sprite.anims.stop();
    this.sprite.setTexture(getPose(this.charId, move.type === 'super' || this.health <= 0 ? 'knockdown' : 'hit'));
    this.invuln = move.type === 'super' ? 4 : 6;
    this.comboCount = 0;

    attacker.meter = Math.min(attacker.maxMeter, attacker.meter + (move.type === 'super' ? 0 : 24));
    attacker.comboCount++;
    attacker.comboTimer = 60;

    this.spawnHitEffect();

    if (move.type === 'super' || this.health <= 0) {
      this.knockdownTimer = move.type === 'super' ? 55 : 24;
      this.state = STATE.KNOCKDOWN;
    } else {
      this.knockdownTimer = 0;
    }

    return { type: 'hit', damage };
  }

  spawnHitEffect() {
    const spark = this.scene.add.image(this.x, this.y - 70 * this.scale / 2.55, 'hit-spark').setDepth(30);
    this.scene.tweens.add({
      targets: spark,
      alpha: 0,
      scale: 2.2,
      duration: 200,
      onComplete: () => spark.destroy()
    });
  }

  markHitLanded(frame) {
    this.hitsThisMove++;
    this.lastHitFrame = frame;
  }

  canHitAgain() {
    const m = this.currentMove;
    if (!m) return false;
    return this.hitsThisMove < (m.maxHits || 1);
  }

  updateComboTimer() {
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) this.comboCount = 0;
    }
  }

  setWin() {
    this.state = STATE.WIN;
    this.attackPoseLocked = false;
    this.setMovementPose('idle');
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);
  }

  setLose() {
    this.state = STATE.LOSE;
    this.attackPoseLocked = false;
    this.sprite.anims.stop();
    this.sprite.setTexture(getPose(this.charId, 'knockdown'));
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);
  }

  destroy() {
    this.sprite.destroy();
  }
}

export { STATE };
