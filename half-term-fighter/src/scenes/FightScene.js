import Phaser from 'phaser';
import { Fighter, STATE } from '../fighters/Fighter.js';
import { AIController } from '../fighters/AIController.js';
import { setupTouchControls } from '../systems/TouchControls.js';
import { CHARACTERS, GAME, MOTIONS, MOVES } from '../systems/CombatData.js';
import { InputBuffer } from '../systems/InputBuffer.js';
import { Projectile } from '../systems/Projectile.js';
import { getFighterScaleBoost, getGameZoom, isMobileLayout } from '../systems/MobileLayout.js';

function createKeyboard(scene) {
  return scene.input.keyboard.addKeys({
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
}

function readKeyboard(keys) {
  return {
    left: keys.left.isDown || keys.leftArrow.isDown,
    right: keys.right.isDown || keys.rightArrow.isDown,
    up: keys.up.isDown || keys.upArrow.isDown,
    down: keys.down.isDown || keys.downArrow.isDown,
    punch: Phaser.Input.Keyboard.JustDown(keys.punch) || Phaser.Input.Keyboard.JustDown(keys.altPunch),
    kick: Phaser.Input.Keyboard.JustDown(keys.kick) || Phaser.Input.Keyboard.JustDown(keys.altKick)
  };
}

export class FightScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FightScene' });
  }

  init(data) {
    this.playerChar = data.playerChar || 'dad';
    this.cpuChar = data.cpuChar || 'kid';
  }

  create() {
    this.frame = 0;
    this.roundTimer = GAME.ROUND_TIME;
    this.roundOver = false;
    this.fightStarted = false;
    this.hitstopFrames = 0;
    this.touchState = null;
    this.projectiles = [];
    this.inputBuffer = new InputBuffer();
    this.superFreezeFrames = 0;
    this.mobileLayout = isMobileLayout();
    this.gameZoom = getGameZoom();

    this.createStage();
    this.createFighters();
    this.createHUD();
    this.setupInput();
    this.setupCallbacks();

    const { width } = this.cameras.main;
    this.ground = this.add.rectangle(width / 2, GAME.GROUND_Y + 10, width, 24, 0x000000, 0);
    this.physics.add.existing(this.ground, true);
    this.physics.add.collider(this.player.sprite, this.ground);
    this.physics.add.collider(this.cpu.sprite, this.ground);

    this.prevInput = { left: false, right: false, up: false, down: false };
    this.prevTouch = { punch: false, kick: false, special: false, super: false };

    this.cameras.main.fadeIn(400, 0, 0, 0);

    if (this.mobileLayout) {
      this.applyMobileFightZoom = () => {
        this.gameZoom = getGameZoom();
        this.cameras.main.setZoom(this.gameZoom);
        this.cameras.main.centerOn(GAME.WIDTH / 2, GAME.HEIGHT * 0.52);
        if (this.hud) {
          const { width, height } = this.cameras.main;
          this.hud.setScale(this.gameZoom);
          this.hud.x = (width - width * this.gameZoom) / 2;
          this.hud.y = (height - height * this.gameZoom) / 2 - 24;
        }
      };
      this.applyMobileFightZoom();
      this.scale.on('resize', () => {
        this.applyMobileStageLayout?.();
        this.applyMobileFightZoom();
      });
    }

    this.showAnnouncement('ROUND 1', () => {
      this.showAnnouncement('FIGHT!', () => {
        this.fightStarted = true;
      });
    });
  }

  setupCallbacks() {
    this.onSuperStarted = (fighter) => {
      const name = CHARACTERS[fighter.charId].superName;
      this.showMoveName(name, '#ff4444');
      this.superFreezeFrames = 32;
      this.hitstopFrames = 14;
      this.time.timeScale = 0.35;
      this.time.delayedCall(680, () => { this.time.timeScale = 1; });

      const { width, height } = this.cameras.main;
      this.superOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x220011, 0.82).setDepth(90);
      this.tweens.add({ targets: this.superOverlay, alpha: 0, duration: 1400, delay: 400, onComplete: () => this.superOverlay?.destroy() });

      this.cameras.main.flash(900, 255, 200, 80);
      this.cameras.main.shake(1600, 0.075);
      const baseZoom = this.mobileLayout ? this.gameZoom : 1;
      this.cameras.main.zoomTo(baseZoom * 1.12, 120);
      this.time.delayedCall(900, () => {
        this.cameras.main.zoomTo(baseZoom, 550);
        this.applyMobileFightZoom?.();
      });

      const fx = fighter.facing;
      const tint = fighter.charId === 'kid' ? 0xff66cc : 0xffaa44;

      for (let i = 0; i < 14; i++) {
        const beam = this.add.image(fighter.x, fighter.y - 90 - i * 16, 'super-beam')
          .setFlipX(fx === -1)
          .setTint(tint)
          .setScale(fx * (1.6 + i * 0.4), 1.8 + i * 0.55)
          .setDepth(25)
          .setAlpha(0.98);
        this.tweens.add({
          targets: beam,
          alpha: 0,
          x: fighter.x + fx * (380 + i * 90),
          scaleX: fx * 6.5,
          duration: 280 + i * 40,
          onComplete: () => beam.destroy()
        });
      }

      const ring = this.add.circle(fighter.x, fighter.y - 75, 20, tint, 0.9).setDepth(26).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: ring,
        scale: 14,
        alpha: 0,
        duration: 650,
        onComplete: () => ring.destroy()
      });

      const burst = this.add.particles(fighter.x + fx * 90, fighter.y - 70, 'hit-spark', {
        speed: { min: 220, max: 520 },
        angle: { min: fx === 1 ? -55 : 125, max: fx === 1 ? 55 : 235 },
        lifespan: 650,
        quantity: 42,
        scale: { start: 0.9, end: 0.04 },
        tint: [0xffd700, 0xff4488, 0x44aaff, 0xffffff, tint],
        blendMode: 'ADD'
      });
      this.time.delayedCall(550, () => burst.destroy());
    };

    this.onSpecialStarted = (fighter, moveId) => {
      const data = CHARACTERS[fighter.charId];
      const name = moveId === 'specialPunch' ? data.specialPunchName : data.specialKickName;
      this.showMoveName(name, '#60a5fa');
      this.cameras.main.flash(220, 80, 140, 255);
      this.cameras.main.shake(280, 0.015);

      fighter.sprite.setTint(0x88ccff);
      this.time.delayedCall(350, () => fighter.sprite.clearTint());
    };
  }

  spawnProjectile(fighter, moveId, index = 0) {
    const proj = new Projectile(this, fighter, moveId, index);
    this.projectiles.push(proj);
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter((p) => p.alive);
    for (const proj of this.projectiles) {
      proj.update();
      if (!proj.alive) continue;

      for (const defender of [this.player, this.cpu]) {
        if (!proj.canHit(defender)) continue;
        const dx = Math.abs(proj.x - defender.x);
        const dy = Math.abs(proj.y - (defender.y - 60));
        if (dx > 70 || dy > 90) continue;

        const move = MOVES[proj.moveId];
        const damage = proj.owner.calcDamage(move);
        const result = defender.receiveHit(proj.owner, damage, move);
        if (result.type === 'hit') {
          proj.markHit();
          this.showCombo(proj.owner);
          this.hitstopFrames = move.type === 'super' ? 10 : move.type === 'special' ? 5 : 3;
          if (move.type === 'super') {
            this.cameras.main.shake(350, 0.028);
            this.showMoveName('PERFECT!', '#ffd700');
          } else if (move.type === 'special') {
            this.cameras.main.shake(180, 0.014);
          }
        }
      }
    }
  }

  createStage() {
    const { width, height } = this.cameras.main;
    const bg = this.add.image(width / 2, height / 2, 'stage');
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale).setDepth(0);

    if (this.mobileLayout) {
      bg.setScrollFactor(0);
      this.stageBg = bg;
      this.applyMobileStageLayout = () => {
        const cam = this.cameras.main;
        const s = Math.max(cam.width / bg.width, cam.height / bg.height);
        bg.setPosition(cam.width / 2, cam.height / 2);
        bg.setScale(s);
      };
      this.applyMobileStageLayout();
      this.scale.on('resize', this.applyMobileStageLayout);
    }

    this.add.rectangle(width / 2, GAME.GROUND_Y + 4, width, 8, 0x000000, 0.35).setDepth(1);

    this.rainParticles = this.add.particles(0, 0, 'hit-spark', {
      x: { min: 0, max: width },
      y: -10,
      lifespan: 1000,
      speedY: { min: 350, max: 550 },
      speedX: { min: -40, max: -15 },
      scale: { start: 0.12, end: 0.03 },
      alpha: { start: 0.25, end: 0 },
      frequency: 60,
      tint: 0x8899bb,
      blendMode: 'ADD'
    }).setDepth(5);
    if (this.mobileLayout) {
      this.rainParticles.setScrollFactor(0);
    }
  }

  createFighters() {
    this.player = new Fighter(this, 400, this.playerChar, true, 1);
    this.cpu = new Fighter(this, 880, this.cpuChar, false, -1);
    this.player.opponent = this.cpu;
    this.cpu.opponent = this.player;
    this.ai = new AIController(this.cpu, this.player);

    if (this.mobileLayout) {
      const boost = getFighterScaleBoost();
      for (const f of [this.player, this.cpu]) {
        f.scale *= boost;
        f.sprite.setScale(f.scale);
        f.sprite.body.setSize(46 * boost, 98 * boost);
      }
      this.cameras.main.setZoom(this.gameZoom);
      this.cameras.main.centerOn(GAME.WIDTH / 2, GAME.HEIGHT * 0.52);
    }
  }

  setupInput() {
    this.keys = createKeyboard(this);
    this.removeTouch = setupTouchControls(this, (state) => {
      this.touchState = state;
    });
  }

  createHUD() {
    const { width, height } = this.cameras.main;
    this.hud = this.add.container(0, 0).setDepth(100);

    this.p1HealthBg = this.add.rectangle(310, 36, 520, 28, 0x1a1a1a).setOrigin(1, 0.5).setStrokeStyle(2, 0x555555);
    this.p2HealthBg = this.add.rectangle(width - 310, 36, 520, 28, 0x1a1a1a).setOrigin(0, 0.5).setStrokeStyle(2, 0x555555);
    this.p1Damage = this.add.rectangle(310, 36, 500, 22, 0xcc0000).setOrigin(1, 0.5);
    this.p2Damage = this.add.rectangle(width - 310, 36, 500, 22, 0xcc0000).setOrigin(0, 0.5);
    this.p1Health = this.add.rectangle(310, 36, 500, 22, 0xffcc00).setOrigin(1, 0.5);
    this.p2Health = this.add.rectangle(width - 310, 36, 500, 22, 0xffcc00).setOrigin(0, 0.5);

    this.add.rectangle(58, 58, 100, 100, 0x000000, 0.5).setStrokeStyle(3, 0x888888);
    this.add.rectangle(width - 58, 58, 100, 100, 0x000000, 0.5).setStrokeStyle(3, 0x888888);
    this.p1Portrait = this.add.image(58, 58, CHARACTERS[this.playerChar].portrait).setDisplaySize(88, 88);
    this.p2Portrait = this.add.image(width - 58, 58, CHARACTERS[this.cpuChar].portrait).setDisplaySize(88, 88);

    const p1Color = this.playerChar === 'dad' ? '#ef4444' : '#f97316';
    const p2Color = this.cpuChar === 'dad' ? '#ef4444' : '#f97316';

    this.p1Name = this.add.text(120, 22, CHARACTERS[this.playerChar].name, {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '24px', color: '#fff', stroke: p1Color, strokeThickness: 1
    });
    this.p2Name = this.add.text(width - 120, 22, CHARACTERS[this.cpuChar].name, {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '24px', color: '#fff', stroke: p2Color, strokeThickness: 1
    }).setOrigin(1, 0);

    this.timerBg = this.add.circle(width / 2, 50, 38, 0x222222).setStrokeStyle(4, 0x666666);
    this.timerInner = this.add.circle(width / 2, 50, 32, 0x111111);
    this.timerText = this.add.text(width / 2, 50, String(GAME.ROUND_TIME), {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '34px', color: '#ffd700', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.dayLabel = this.add.text(width / 2, 10, GAME.DAY_LABEL, {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#94a3b8'
    }).setOrigin(0.5);

    this.p1MeterBg = this.add.rectangle(180, height - 28, 340, 16, 0x222222).setStrokeStyle(1, 0x444444);
    this.p2MeterBg = this.add.rectangle(width - 180, height - 28, 340, 16, 0x222222).setStrokeStyle(1, 0x444444);
    this.p1Meter = this.add.rectangle(10, height - 28, 0, 12, 0xff8800).setOrigin(0, 0.5);
    this.p2Meter = this.add.rectangle(width - 10, height - 28, 0, 12, 0xff8800).setOrigin(1, 0.5);

    this.p1MaxLabel = this.add.text(10, height - 48, 'MAX', {
      fontFamily: 'Impact, sans-serif', fontSize: '16px', color: '#555', stroke: '#000', strokeThickness: 2
    });
    this.p2MaxLabel = this.add.text(width - 10, height - 48, 'MAX', {
      fontFamily: 'Impact, sans-serif', fontSize: '16px', color: '#555', stroke: '#000', strokeThickness: 2
    }).setOrigin(1, 0);

    this.comboText = this.add.text(width / 2, 130, '', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '40px', color: '#ffd700', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0);

    this.moveNameText = this.add.text(width / 2, 170, '', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '42px', color: '#fff', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0).setDepth(110);

    this.announceText = this.add.text(width / 2, height / 2, '', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '80px', color: '#ffd700', stroke: '#000', strokeThickness: 8
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.hud.add([
      this.p1HealthBg, this.p2HealthBg, this.p1Damage, this.p2Damage,
      this.p1Health, this.p2Health, this.p1Portrait, this.p2Portrait,
      this.p1Name, this.p2Name, this.timerBg, this.timerInner, this.timerText, this.dayLabel,
      this.p1MeterBg, this.p2MeterBg, this.p1Meter, this.p2Meter,
      this.p1MaxLabel, this.p2MaxLabel, this.comboText, this.moveNameText, this.announceText
    ]);

    if (this.mobileLayout) {
      this.hud.setScrollFactor(0);
      this.hud.setScale(this.gameZoom);
      this.hud.x = (width - width * this.gameZoom) / 2;
      this.hud.y = (height - height * this.gameZoom) / 2 - 24;
    }
  }

  showMoveName(text, color = '#ffd700') {
    this.moveNameText.setText(text).setColor(color).setAlpha(1).setScale(0.6);
    this.tweens.add({
      targets: this.moveNameText,
      scale: 1,
      duration: 150,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({ targets: this.moveNameText, alpha: 0, duration: 600, delay: 400 });
      }
    });
  }

  showAnnouncement(text, onComplete) {
    this.announceText.setText(text).setAlpha(1).setScale(0.5);
    this.tweens.add({
      targets: this.announceText,
      scale: 1.2,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(600, () => {
          this.tweens.add({
            targets: this.announceText,
            alpha: 0,
            duration: 200,
            onComplete: () => onComplete?.()
          });
        });
      }
    });
  }

  update(_time, delta) {
    if (this.roundOver) return;

    // Hitstun/knockdown must tick even during hitstop — otherwise freeze extends stun forever.
    [this.player, this.cpu].forEach((f) => {
      f.tickHitRecovery();
      f.tickJumpGrace();
      f.tickCooldowns();
      f.snapToGround();
    });

    if (this.hitstopFrames > 0) {
      this.hitstopFrames--;
      return;
    }

    if (this.superFreezeFrames > 0) {
      this.superFreezeFrames--;
      this.updateProjectiles();
      this.updateHUD();
      return;
    }

    this.frame++;
    this.inputBuffer.tick();

    if (this.fightStarted && this.roundTimer > 0) {
      this.roundTimer -= delta / 1000;
      this.timerText.setText(String(Math.ceil(Math.max(0, this.roundTimer))));
      if (this.roundTimer <= 10) this.timerText.setColor('#ff4444');
    }

    this.player.updateFacing(this.cpu);
    this.cpu.updateFacing(this.player);

    if (this.fightStarted) {
      this.processPlayerInput();
      this.processCPUInput();
    }

    const p1Strike = this.player.updateAttack();
    const p2Strike = this.cpu.updateAttack();

    this.updateProjectiles();
    this.separateFighters();
    this.player.updateComboTimer();
    this.cpu.updateComboTimer();

    if (p1Strike) this.checkHit(this.player, this.cpu);
    if (p2Strike) this.checkHit(this.cpu, this.player);

    this.updateHUD();

    if (this.fightStarted) {
      if (!this.player.isAlive || !this.cpu.isAlive) this.endRound();
      else if (this.roundTimer <= 0) this.endRound();
    }
  }

  separateFighters() {
    const minGap = GAME.MIN_FIGHTER_GAP;
    const dx = this.cpu.x - this.player.x;
    const dist = Math.abs(dx);
    const sign = dx >= 0 ? 1 : -1;

    if (dist < minGap && !this.player.isBusy && !this.cpu.isBusy) {
      const push = (minGap - dist) / 2 + 1;
      this.player.sprite.x -= sign * push;
      this.cpu.sprite.x += sign * push;
    }
  }

  pushDirectionsToBuffer(input) {
    const buf = this.inputBuffer;
    const f = this.frame;
    const prev = this.prevInput ?? {};

    // Fresh quarter-circle when down is newly pressed — clears walk-in pollution
    if (input.down && !prev.down) {
      buf.clearMotion();
      buf.push('down', f);
    } else if (input.down && input.left) buf.push('down-left', f);
    else if (input.down && input.right) buf.push('down-right', f);
    else if (input.down) buf.push('down', f);
    else if (input.up) buf.push('up', f);
    else if (input.left) buf.push('left', f);
    else if (input.right) buf.push('right', f);

    if (input.punch) buf.push('punch', f);
    if (input.kick) buf.push('kick', f);

    this.prevInput = {
      left: !!input.left,
      right: !!input.right,
      up: !!input.up,
      down: !!input.down
    };
  }

  readPlayerInput() {
    let raw;
    if (this.touchState) {
      const punch = this.touchState.punch && !this.prevTouch.punch;
      const kick = this.touchState.kick && !this.prevTouch.kick;
      const special = this.touchState.special && !this.prevTouch.special;
      const superMove = this.touchState.super && !this.prevTouch.super;
      this.prevTouch = {
        punch: !!this.touchState.punch,
        kick: !!this.touchState.kick,
        special: !!this.touchState.special,
        super: !!this.touchState.super
      };
      raw = {
        left: this.touchState.left,
        right: this.touchState.right,
        up: this.touchState.up,
        down: this.touchState.down,
        punch,
        kick,
        special,
        super: superMove
      };
    } else {
      raw = readKeyboard(this.keys);
    }
    return raw;
  }

  resolveMotionAttack(fighter, input) {
    if (!fighter.isGrounded) return false;
    const buf = this.inputBuffer;
    const facing = fighter.facing;
    const window = 12;

    const tryMotion = (motionKey, moveId) => {
      const m = MOTIONS[motionKey];
      if (!buf.matchMotionForFacing(m.sequence, facing)) return false;
      if (!buf.wasPressed(m.button, window)) return false;
      if (moveId === 'super' && fighter.meter < 100) return false;
      if ((moveId === 'specialPunch' || moveId === 'specialKick') && fighter.specialCooldown > 0) {
        if (fighter.isPlayer) this.showMoveName('CATCHING BREATH...', '#94a3b8');
        return false;
      }
      buf.clearMotion();
      buf.consume(m.button);
      return fighter.tryStartMove(moveId, fighter.opponent);
    };

    if (input.punch || input.kick) {
      if (input.kick && tryMotion('super', 'super')) return true;
      if (input.punch && tryMotion('specialPunch', 'specialPunch')) return true;
      if (input.kick && tryMotion('specialKick', 'specialKick')) return true;
    }
    return false;
  }

  resolveAttack(fighter, input) {
    if (input.super && fighter.meter >= 100 && fighter.isGrounded) {
      if (fighter.tryStartMove('super', fighter.opponent)) return true;
    }
    if (input.special && fighter.isGrounded) {
      if (fighter.tryStartMove('specialPunch', fighter.opponent)) return true;
    }

    if (this.resolveMotionAttack(fighter, input)) return true;

    // Don't turn a failed special motion into a normal punch/kick
    if (this.inputBuffer.motionTimer > 0 && (input.punch || input.kick)) {
      return false;
    }

    if (input.punch) {
      if (!fighter.isGrounded) return fighter.tryStartMove('jumpKick', fighter.opponent);
      return fighter.tryStartMove('lightPunch', fighter.opponent);
    }

    if (input.kick && fighter.isGrounded) {
      return fighter.tryStartMove('lightKick', fighter.opponent);
    }

    return false;
  }

  processPlayerInput() {
    const input = this.readPlayerInput();
    this.pushDirectionsToBuffer(input);

    if (this.resolveAttack(this.player, input)) {
      return;
    }

    this.player.tryConsumeQueuedMove();
    this.player.applyInput(input);
  }

  processCPUInput() {
    this.ai.tickTimers();

    const pending = this.ai.consumePendingMove();
    if (pending && !this.cpu.isBusy) {
      this.cpu.tryStartMove(pending, this.cpu.opponent);
    }

    if (!this.cpu.isBusy) {
      const aiInput = this.ai.update();
      this.cpu.applyInput(aiInput);
      this.cpu.tryConsumeQueuedMove();
    }
  }

  checkHit(attacker, defender) {
    if (!attacker.canHitAgain() || !attacker.currentMove) return;

    const move = attacker.currentMove;
    const damage = attacker.calcDamage(move);
    const result = defender.receiveHit(attacker, damage, move);
    if (result.type === 'hit') {
      attacker.markHitLanded(attacker.moveFrame);
      this.showCombo(attacker);
      this.hitstopFrames = move.type === 'super' ? 10 : move.type === 'special' ? 5 : 2;
      if (move.type === 'special') {
        this.cameras.main.shake(200, 0.012);
        this.cameras.main.flash(140, 100, 160, 255, false);
      }
      if (move.type === 'super') {
        this.cameras.main.shake(420, 0.028);
        this.showMoveName('PERFECT!', '#ffd700');
      }
    }
  }

  showCombo(attacker) {
    if (attacker.comboCount < 2) return;
    this.comboText.setText(`${attacker.comboCount} HIT COMBO!`).setAlpha(1);
    this.tweens.add({ targets: this.comboText, alpha: 0, duration: 800, delay: 400 });
  }

  updateHUD() {
    const p1Pct = this.player.health / this.player.maxHealth;
    const p2Pct = this.cpu.health / this.cpu.maxHealth;

    this.p1Health.width = 500 * p1Pct;
    this.p2Health.width = 500 * p2Pct;
    this.p1Damage.width = Phaser.Math.Linear(this.p1Damage.width, 500 * p1Pct, 0.08);
    this.p2Damage.width = Phaser.Math.Linear(this.p2Damage.width, 500 * p2Pct, 0.08);

    this.p1Meter.width = 340 * (this.player.meter / 100);
    this.p2Meter.width = 340 * (this.cpu.meter / 100);

    const maxColor = '#ffd700';
    const dimColor = '#555';
    this.p1MaxLabel.setColor(this.player.meter >= 100 ? maxColor : dimColor);
    this.p2MaxLabel.setColor(this.cpu.meter >= 100 ? maxColor : dimColor);
  }

  endRound() {
    if (this.roundOver) return;
    this.roundOver = true;
    this.projectiles.forEach((p) => p.destroy());
    this.projectiles = [];

    let winner;
    if (!this.player.isAlive) winner = this.cpu;
    else if (!this.cpu.isAlive) winner = this.player;
    else winner = this.player.health >= this.cpu.health ? this.player : this.cpu;

    const playerWon = winner === this.player;
    winner.setWin();
    (playerWon ? this.cpu : this.player).setLose();

    const msg = playerWon ? 'YOU WIN!' : 'YOU LOSE!';
    this.time.delayedCall(800, () => {
      this.showAnnouncement(playerWon ? 'K.O.!' : 'DEFEAT...', () => {
        this.time.delayedCall(1000, () => this.showResultScreen(playerWon, msg));
      });
    });
  }

  showResultScreen(won, msg) {
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(150);

    this.add.text(width / 2, height / 2 - 60, msg, {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '64px',
      color: won ? '#ffd700' : '#ef4444', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(151);

    const sub = won
      ? (this.playerChar === 'dad' ? 'The parents survive... barely.' : 'Impossible. The kids lost?!')
      : (this.playerChar === 'dad' ? 'Half term continues. No mercy.' : 'The kids win again. Of course.');
    this.add.text(width / 2, height / 2 + 20, sub, {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#94a3b8'
    }).setOrigin(0.5).setDepth(151);

    const retry = this.add.text(width / 2, height / 2 + 100, '[ CLICK TO REMATCH ]', {
      fontFamily: 'Impact, sans-serif', fontSize: '24px', color: '#fff'
    }).setOrigin(0.5).setDepth(151).setInteractive({ useHandCursor: true });

    retry.on('pointerdown', () => {
      this.scene.restart({ playerChar: this.playerChar, cpuChar: this.cpuChar });
    });

    this.add.text(width / 2, height / 2 + 150, '[ CHANGE FIGHTER ]', {
      fontFamily: 'Impact, sans-serif', fontSize: '18px', color: '#64748b'
    }).setOrigin(0.5).setDepth(151).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => this.scene.start('CharacterSelectScene'));
      });
  }
}
