import Phaser from 'phaser';
import { CHARACTERS, GAME } from '../systems/CombatData.js';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Title banner
    this.add.text(width / 2, 60, 'SELECT YOUR FIGHTER', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '48px',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 110, GAME.DAY_LABEL, {
      fontFamily: 'Courier New, monospace',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    this.add.text(width / 2, 140, 'Choose who you control — face the other side!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#64748b'
    }).setOrigin(0.5);

    this.createFighterCard(width * 0.3, height * 0.52, 'dad', 'PLAY AS\nPARENTS', 0x2563eb,
      'Heavy hits · Slower · CAFFEINE CRASH super');
    this.createFighterCard(width * 0.7, height * 0.52, 'kid', 'PLAY AS\nKIDS', 0xf97316,
      'Fast · More HP · SUGAR RUSH ULTIMATE super');

    this.add.text(width / 2, height - 90, 'HALF TERM PUNCHDOWN — comedy arcade brawler', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '18px',
      color: '#64748b'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 58, 'Move ◀▶  ·  Punch J  ·  Kick K  ·  Special ↓↘→+J/K  ·  Super ↓↘→↓↘→+K (full meter)', {
      fontFamily: 'Courier New, monospace',
      fontSize: '12px',
      color: '#475569'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 38, 'Quarter-circle motions on d-pad. Dad throws mugs, kid fires stars.', {
      fontFamily: 'Courier New, monospace',
      fontSize: '12px',
      color: '#475569'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 18, 'Click a fighter to start  ·  99 second round', {
      fontFamily: 'Courier New, monospace',
      fontSize: '13px',
      color: '#64748b'
    }).setOrigin(0.5);

    // VS
    this.add.text(width / 2, height * 0.52, 'VS', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '72px',
      color: '#ef4444',
      stroke: '#000',
      strokeThickness: 8
    }).setOrigin(0.5);
  }

  createFighterCard(x, y, charId, label, color, hint) {
    const data = CHARACTERS[charId];
    const card = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 320, 420, 0x1e1e3f)
      .setStrokeStyle(4, color)
      .setInteractive({ useHandCursor: true });

    const portrait = this.add.image(0, -100, data.portrait).setDisplaySize(160, 160).setDepth(2);

    const name = this.add.text(0, 30, data.name, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const tag = this.add.text(0, 70, data.tag, {
      fontFamily: 'Courier New, monospace',
      fontSize: '11px',
      color: '#94a3b8',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);

    const btnLabel = this.add.text(0, 120, label, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffd700',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    const hintText = this.add.text(0, 165, hint || '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '10px',
      color: '#64748b',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);

    card.add([bg, portrait, name, tag, btnLabel, hintText]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x2a2a5f);
      card.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x1e1e3f);
      card.setScale(1);
    });
    bg.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('FightScene', {
          playerChar: charId,
          cpuChar: charId === 'dad' ? 'kid' : 'dad'
        });
      });
    });
  }
}
