import Phaser from 'phaser';
import { MainMenuScene } from '../scenes/MainMenuScene';

export function createMainMenu() {
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
        scene: [MainMenuScene],
        backgroundColor: '#87CEEB',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };
    
    return new Phaser.Game(config);
} 