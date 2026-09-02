import Phaser from 'phaser';
import { registerAnimations, loadCharacterPoses } from '../systems/SpriteFactory.js';

const ASSET_VER = 'v19';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.setPath('/half-term-fighter/assets');
    const q = `?${ASSET_VER}`;
    this.load.image('stage', `stage.png${q}`);
    this.load.image('dad-portrait', `dad-portrait.png${q}`);
    this.load.image('kid-portrait', `kid-portrait.png${q}`);
    loadCharacterPoses(this.load, 'dad', q);
    loadCharacterPoses(this.load, 'kid', q);
  }

  create() {
    ['dad', 'kid'].forEach((key) => {
      ['idle', 'walk', 'punch', 'kick', 'special', 'super'].forEach((pose) => {
        const tex = `${key}-${pose}`;
        if (this.textures.exists(tex)) {
          this.textures.get(tex).setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
      });
    });
    registerAnimations(this, 'dad');
    registerAnimations(this, 'kid');
    this.createEffectTextures();
    this.scene.start('CharacterSelectScene');
  }

  createEffectTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 14);
    g.fillStyle(0xffdd00, 1);
    g.fillCircle(16, 16, 8);
    g.fillStyle(0xff6600, 1);
    g.fillCircle(16, 16, 4);
    g.generateTexture('hit-spark', 32, 32);
    g.clear();

    g.fillStyle(0xfbbf24, 0.95);
    g.fillRect(0, 0, 128, 24);
    g.fillStyle(0xffffff, 0.8);
    g.fillRect(0, 8, 128, 8);
    g.fillStyle(0xf472b6, 0.6);
    g.fillRect(16, 4, 96, 16);
    g.generateTexture('super-beam', 128, 24);
    g.clear();

    g.fillStyle(0xffffff, 1);
    g.fillCircle(20, 20, 18);
    g.fillStyle(0x60a5fa, 0.85);
    g.fillCircle(20, 20, 12);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(14, 14, 5);
    g.generateTexture('special-orb', 40, 40);
    g.clear();

    g.lineStyle(3, 0x60a5fa, 0.9);
    g.strokeCircle(16, 16, 14);
    g.lineStyle(2, 0xffffff, 0.7);
    g.strokeCircle(16, 16, 10);
    g.fillStyle(0x3b82f6, 0.3);
    g.fillCircle(16, 16, 12);
    g.generateTexture('block-shield', 32, 32);
    g.clear();

    // Dad's thrown mug
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 12, 26, 20);
    g.fillStyle(0x8b4513, 1);
    g.fillRect(10, 16, 18, 10);
    g.lineStyle(3, 0xcccccc, 1);
    g.strokeRect(6, 12, 26, 20);
    g.lineStyle(4, 0xcccccc, 1);
    g.beginPath();
    g.arc(34, 22, 7, -1.1, 1.1);
    g.strokePath();
    g.fillStyle(0xef4444, 1);
    g.fillRect(10, 8, 18, 5);
    g.generateTexture('mug-projectile', 44, 36);
    g.clear();

    // Kid's star blast
    const cx = 22, cy = 22, spikes = 5, outer = 20, inner = 9;
    g.fillStyle(0xffdd00, 1);
    g.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.fillPath();
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(18, 18, 6);
    g.generateTexture('star-projectile', 44, 44);
    g.clear();

    g.fillStyle(0x888888, 0.5);
    g.fillCircle(8, 8, 6);
    g.fillCircle(14, 10, 4);
    g.generateTexture('dust', 20, 16);
    g.destroy();
  }
}
