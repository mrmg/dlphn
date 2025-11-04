import Phaser from 'phaser';
import { TamagotchiGameScene } from '../scenes/tamagotchi/TamagotchiGameScene';
import { ModeSelectionScene } from '../scenes/tamagotchi/ModeSelectionScene';

export function createTamagotchiGame() {
    // Calculate game dimensions based on screen size
    const getGameDimensions = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {
            width: Math.min(width, 414), // iPhone Plus width as max
            height: Math.min(height, 896) // iPhone Plus height as max
        };
    };

    const dimensions = getGameDimensions();
    
    const config = {
        type: Phaser.AUTO,
        width: dimensions.width,
        height: dimensions.height,
        parent: 'game',
        scene: [ModeSelectionScene, TamagotchiGameScene],
        backgroundColor: '#FFB6C1',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };
    
    return new Phaser.Game(config);
} 