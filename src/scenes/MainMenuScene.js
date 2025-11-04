import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Create simple colored rectangles for buttons if no assets exist
        this.load.image('button', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(width/2, height/2, width, height, 0x87CEEB);

        // Title
        const title = this.add.text(width/2, height * 0.2, 'Game Collection', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width/2, height * 0.3, 'Choose your adventure!', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Game buttons
        this.createGameButton(width/2, height * 0.4, 'Dolphin Thursdays', 'dolphin', 0x4169E1);
        this.createGameButton(width/2, height * 0.5, 'Tamagotchi Pet', 'tamagotchi', 0x32CD32);
        this.createGameButton(width/2, height * 0.6, 'Player Card Maker', 'card', 0xFFD700);
        this.createGameButton(width/2, height * 0.7, 'Ideas Generator', 'ideas', 0xFF6B35);
        this.createGameButton(width/2, height * 0.8, 'Monster Creator', 'monster', 0x9C27B0);
        this.createGameButton(width/2, height * 0.9, 'Monster Gallery', 'gallery', 0xFF9800);
        
        // Footer
        this.add.text(width/2, height * 0.95, 'Select a game to play or create art!', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#666666'
        }).setOrigin(0.5);
    }

    createGameButton(x, y, text, route, color) {
        const button = this.add.rectangle(x, y, 300, 60, color)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Hover effects
        button.on('pointerover', () => {
            button.setScale(1.05);
            buttonText.setScale(1.05);
        });

        button.on('pointerout', () => {
            button.setScale(1);
            buttonText.setScale(1);
        });

        // Navigation
        button.on('pointerdown', () => {
            if (route === 'ideas') {
                // Navigate to ideas.html page
                window.location.href = '/ideas.html';
            } else if (route === 'card') {
                // Navigate to the Player Card Maker app (explicit index.html for Vite dev)
                window.location.href = '/card/index.html';
            } else if (route === 'monster') {
                // Navigate to monster creator
                window.location.href = '/monster/monster.html';
            } else if (route === 'gallery') {
                // Navigate to monster gallery
                window.location.href = '/monster/gallery.html';
            } else {
                // Use hash routing for games
                window.location.hash = `#${route}`;
            }
        });

        return { button, text: buttonText };
    }
} 
