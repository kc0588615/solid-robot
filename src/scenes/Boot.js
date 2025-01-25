import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load minimal assets needed for preloader
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.scene.start('Preloader');
    }
}