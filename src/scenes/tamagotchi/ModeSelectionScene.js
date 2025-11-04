export class ModeSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ModeSelectionScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background
        this.cameras.main.setBackgroundColor('#001122');
        
        // Game title (from main game)
        this.add.text(width/2, 20, '🐬 DOLPHIN TAMAGOTCHI 🐬', {
            fontSize: '20px',
            fontFamily: 'monospace',
            fill: '#00ffff',
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Countdown timer (from main game)
        this.countdownText = this.add.text(width/2, 45, '', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Initialize countdown
        this.updateCountdownTimer();
        
        // Title
        this.add.text(width/2, height/2 - 180, 'Choose Game Mode', {
            fontSize: '28px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center',
            wordWrap: { width: width - 40, useAdvancedWrap: true }
        }).setOrigin(0.5);
        
        // Mode descriptions
        this.add.text(width/2, height/2 - 120, 'How would you like to care for your dolphin?', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: width - 40, useAdvancedWrap: true }
        }).setOrigin(0.5);
        
        // Check if user has played for at least 3 minutes to unlock Matt Mode
        const totalPlayTime = parseInt(localStorage.getItem('dolphinTamagotchiPlayTime') || '0');
        const hasUnlockedMatt = totalPlayTime >= 180000; // 3 minutes in milliseconds
        
        // Standard Mode Button (top)
        const standardButton = this.add.rectangle(width/2, height/2 - 20, 280, 90, 0x4CAF50)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff);
            
        const standardText = this.add.text(width/2, height/2 - 45, 'STANDARD MODE', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        const standardIcon = this.add.text(width/2, height/2 - 25, '📱', {
            fontSize: '20px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        const standardDesc = this.add.text(width/2, height/2, 'Quick care with simple clicks.\nPerfect for busy moments!', {
            fontSize: '10px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 260, useAdvancedWrap: true }
        }).setOrigin(0.5);
        
        // Advanced Mode Button (middle)
        const advancedButton = this.add.rectangle(width/2, height/2 + 90, 280, 90, 0x2196F3)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(3, 0xffffff);
            
        const advancedText = this.add.text(width/2, height/2 + 65, 'ADVANCED MODE', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        const advancedIcon = this.add.text(width/2, height/2 + 85, '🎮', {
            fontSize: '20px',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        const advancedDesc = this.add.text(width/2, height/2 + 110, 'Interactive mini-games for each need.\nMore engaging and fun!', {
            fontSize: '10px',
            fontFamily: 'monospace',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 260, useAdvancedWrap: true }
        }).setOrigin(0.5);
        
        // Matt Mode Button (bottom) - only if advanced has been played
        let mattButton = null;
        let mattText = null;
        let mattIcon = null;
        let mattDesc = null;
        
        if (hasUnlockedMatt) {
            mattButton = this.add.rectangle(width/2, height/2 + 200, 280, 90, 0xCC0000)
                .setInteractive({ useHandCursor: true })
                .setStrokeStyle(3, 0xffffff);
                
            mattText = this.add.text(width/2, height/2 + 175, 'MATT MODE', {
                fontSize: '14px',
                fontFamily: 'monospace',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            mattIcon = this.add.text(width/2, height/2 + 195, '🚨', {
                fontSize: '20px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            mattDesc = this.add.text(width/2, height/2 + 220, 'EXTREME DIFFICULTY MODE!\nHarder math, faster drops, more items!', {
                fontSize: '10px',
                fontFamily: 'monospace',
                fill: '#ffcccc',
                align: 'center',
                wordWrap: { width: 260, useAdvancedWrap: true }
            }).setOrigin(0.5);
            
            // Smooth pulsing red animation for Matt Mode button
            this.tweens.add({
                targets: mattButton,
                alpha: { from: 0.8, to: 1.0 },
                duration: 667,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                onUpdate: (tween) => {
                    // Smoothly interpolate between two red shades
                    const progress = tween.progress;
                    const darkRed = 0xCC0000;
                    const brightRed = 0xFF4444;
                    
                    // Extract RGB components
                    const darkR = (darkRed >> 16) & 0xFF;
                    const darkG = (darkRed >> 8) & 0xFF;
                    const darkB = darkRed & 0xFF;
                    
                    const brightR = (brightRed >> 16) & 0xFF;
                    const brightG = (brightRed >> 8) & 0xFF;
                    const brightB = brightRed & 0xFF;
                    
                    // Interpolate each component
                    const r = Math.floor(darkR + (brightR - darkR) * progress);
                    const g = Math.floor(darkG + (brightG - darkG) * progress);
                    const b = Math.floor(darkB + (brightB - darkB) * progress);
                    
                    // Combine back to hex color
                    const newColor = (r << 16) | (g << 8) | b;
                    mattButton.setFillStyle(newColor);
                }
            });
        }
        
        // Hover effects for Standard
        standardButton.on('pointerover', () => {
            standardButton.setScale(1.05);
            standardText.setScale(1.05);
            standardIcon.setScale(1.05);
            standardDesc.setScale(1.05);
            standardButton.setFillStyle(0x66BB6A);
        });
        
        standardButton.on('pointerout', () => {
            standardButton.setScale(1);
            standardText.setScale(1);
            standardIcon.setScale(1);
            standardDesc.setScale(1);
            standardButton.setFillStyle(0x4CAF50);
        });
        
        // Hover effects for Advanced
        advancedButton.on('pointerover', () => {
            advancedButton.setScale(1.05);
            advancedText.setScale(1.05);
            advancedIcon.setScale(1.05);
            advancedDesc.setScale(1.05);
            advancedButton.setFillStyle(0x42A5F5);
        });
        
        advancedButton.on('pointerout', () => {
            advancedButton.setScale(1);
            advancedText.setScale(1);
            advancedIcon.setScale(1);
            advancedDesc.setScale(1);
            advancedButton.setFillStyle(0x2196F3);
        });
        
        // Hover effects for Matt Mode (if it exists)
        if (mattButton) {
            mattButton.on('pointerover', () => {
                mattButton.setScale(1.05);
                mattText.setScale(1.05);
                mattIcon.setScale(1.05);
                mattDesc.setScale(1.05);
                // Don't change color as it's already pulsing
            });
            
            mattButton.on('pointerout', () => {
                mattButton.setScale(1);
                mattText.setScale(1);
                mattIcon.setScale(1);
                mattDesc.setScale(1);
            });
        }

        // Click handlers
        standardButton.on('pointerdown', () => {
            this.selectMode('standard');
        });
        
        advancedButton.on('pointerdown', () => {
            this.selectMode('advanced');
        });
        
        if (mattButton) {
            mattButton.on('pointerdown', () => {
                this.selectMode('matt');
            });
        }
        
        // Back button
        this.createBackButton(80, height - 60);
    }
    
    selectMode(mode) {
        // Store the selected mode in the registry
        this.registry.set('gameMode', mode);
        
        // Visual feedback
        let feedbackText, feedbackColor;
        if (mode === 'standard') {
            feedbackText = 'Standard Mode Selected!';
            feedbackColor = 0x4CAF50;
        } else if (mode === 'advanced') {
            feedbackText = 'Advanced Mode Selected!';
            feedbackColor = 0x2196F3;
        } else if (mode === 'matt') {
            feedbackText = 'MATT MODE SELECTED!';
            feedbackColor = 0xCC0000;
        }
        
        const feedback = this.add.text(this.cameras.main.width/2, this.cameras.main.height/2 + 320, feedbackText, {
            fontSize: '18px',
            fontFamily: 'monospace',
            fill: `#${feedbackColor.toString(16).padStart(6, '0')}`,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0);
        
        this.tweens.add({
            targets: feedback,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(800, () => {
                    this.scene.start('TamagotchiGameScene');
                });
            }
        });
    }
    
    createBackButton(x, y) {
        const button = this.add.rectangle(x, y, 120, 40, 0x666666)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);

        const buttonText = this.add.text(x, y, 'BACK TO MENU', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setFillStyle(0x888888));
        button.on('pointerout', () => button.setFillStyle(0x666666));
        button.on('pointerdown', () => window.location.hash = '#menu');
    }
    
    updateCountdownTimer() {
        const now = new Date();
        const target = new Date();
        target.setHours(15, 35, 0, 0); // 3:35 PM pickup time
        
        // If it's past pickup time today, set target for tomorrow
        if (now > target) {
            target.setDate(target.getDate() + 1);
        }
        
        const timeLeft = target - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        this.countdownText.setText(`⏰ Time until pickup: ${hours}h ${minutes}m ${seconds}s`);
        
        // Update every second
        this.time.delayedCall(1000, () => {
            this.updateCountdownTimer();
        });
    }
} 