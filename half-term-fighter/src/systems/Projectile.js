import { CHARACTERS, MOVES } from './CombatData.js';

function resolveProjectileConfig(owner, moveId) {
  const charCfg = CHARACTERS[owner.charId]?.projectiles?.[moveId];
  const moveCfg = MOVES[moveId]?.projectile ?? {};
  return { ...moveCfg, ...charCfg };
}

export class Projectile {
  constructor(scene, owner, moveId, index = 0) {
    this.scene = scene;
    this.owner = owner;
    this.moveId = moveId;
    this.move = MOVES[moveId];
    this.cfg = resolveProjectileConfig(owner, moveId);
    this.index = index;
    this.alive = true;
    this.hitCount = 0;
    this.maxHits = this.cfg.maxHits ?? 1;
    this.life = this.cfg.lifetime ?? 90;

    const fx = owner.facing;
    const tex = this.cfg.texture ?? 'special-orb';
    const scale = this.cfg.scale ?? 3;

    const spawnX = owner.x + fx * ((this.cfg.offsetX ?? 50) + index * 12);
    const spawnY = owner.y + (this.cfg.offsetY ?? -80) - index * 8;

    this.sprite = scene.physics.add.image(spawnX, spawnY, tex)
      .setScale(scale)
      .setDepth(24)
      .setFlipX(fx === -1);

    // Glow ring so projectiles read clearly on the stage
    this.glow = scene.add.circle(spawnX, spawnY, (this.cfg.width ?? 36) * 0.75, 0xffffff, 0.55)
      .setDepth(23)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.trailRing = scene.add.circle(spawnX, spawnY, (this.cfg.width ?? 36) * 0.45, 0xffdd00, 0.4)
      .setDepth(22)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(this.cfg.width ?? 36, this.cfg.height ?? 36);
    this.sprite.body.setVelocity(
      fx * (this.cfg.speed ?? 480),
      (this.cfg.vy ?? 0) - index * 12
    );

    if (this.cfg.trail) {
      scene.tweens.add({
        targets: [this.sprite, this.glow],
        scale: scale * 1.6,
        alpha: 0.88,
        duration: this.cfg.trail,
        yoyo: true
      });
    }
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update() {
    if (!this.alive) return;

    if (this.cfg.spin) {
      this.sprite.angle += this.cfg.spin / 60;
    }

    if (this.glow?.active) {
      this.glow.x = this.sprite.x;
      this.glow.y = this.sprite.y;
    }
    if (this.trailRing?.active) {
      this.trailRing.x = this.sprite.x;
      this.trailRing.y = this.sprite.y;
    }

    this.life--;
    if (this.life <= 0) {
      this.destroy();
      return;
    }

    const { width } = this.scene.cameras.main;
    if (this.x < -80 || this.x > width + 80) {
      this.destroy();
    }
  }

  canHit(defender) {
    if (!this.alive || !defender.isAlive) return false;
    if (this.hitCount >= this.maxHits) return false;
    if (defender === this.owner) return false;
    if (defender.invuln > 0) return false;
    if (defender.hitstun > 0 && this.move?.type !== 'super') return false;
    return true;
  }

  markHit() {
    this.hitCount++;
    if (this.hitCount >= this.maxHits && !this.cfg.pierce) {
      this.destroy();
    }
  }

  destroy() {
    if (!this.alive) return;
    this.alive = false;
    this.glow?.destroy();
    this.trailRing?.destroy();
    this.sprite.destroy();
  }
}
