import { Scene } from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Load gem assets
        console.log("Loading assets..."); // Debug log
        
        GameConfig.GEMS.TYPES.forEach(type => {
            for (let i = 0; i < GameConfig.GEMS.FRAMES; i++) {
                this.load.image(
                    `${type}_gem_${i}`,
                    `assets/gems/${type}_gem_${i}.png`
                );
            }
        });
    }

    create() {
        this.scene.start('Game');
    }
}