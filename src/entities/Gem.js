import { GameConfig } from '../config/GameConfig';

export class Gem extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, `${type}_gem_0`);
        
        this.type = type;
        this.gridPosition = {x: 0, y: 0};
        this.state = Gem.State.IDLE;
        
        this.setupAnimations();
        this.setInteractive();
    }

    static State = {
        IDLE: 'IDLE',
        FALLING: 'FALLING',
        SWAPPING: 'SWAPPING',
        MATCHED: 'MATCHED'
    };

    setupAnimations() {
        const frameNames = Array.from({length: GameConfig.GEMS.FRAMES}, 
            (_, i) => ({ key: `${this.type}_gem_${i}` }));

        this.scene.anims.create({
            key: `${this.type}_idle`,
            frames: frameNames,
            frameRate: GameConfig.GEMS.ANIMATION_FPS,
            repeat: -1
        });

        this.play(`${this.type}_idle`);
    }

    fall(targetY) {
        this.state = Gem.State.FALLING;
        return new Promise(resolve => {
            this.scene.tweens.add({
                targets: this,
                y: targetY,
                duration: 300,
                ease: 'Bounce.Out',
                onComplete: () => {
                    this.state = Gem.State.IDLE;
                    resolve();
                }
            });
        });
    }

    match() {
        this.state = Gem.State.MATCHED;
        return new Promise(resolve => {
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                scale: 1.2,
                duration: 200,
                ease: 'Power2',
                onComplete: () => resolve()
            });
        });
    }
}