import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { FightScene } from './scenes/FightScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    min: {
      width: 640,
      height: 360
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1800 },
      debug: false
    }
  },
  scene: [BootScene, CharacterSelectScene, FightScene]
};

const game = new Phaser.Game(config);
if (typeof window !== 'undefined') window.__HTF_GAME__ = game;

function syncOrientation() {
  const portrait = window.matchMedia('(orientation: portrait)').matches
    || window.innerHeight > window.innerWidth;
  document.body.classList.toggle('portrait-mode', portrait);
}

syncOrientation();
window.addEventListener('resize', syncOrientation);
window.matchMedia('(orientation: portrait)').addEventListener('change', syncOrientation);
