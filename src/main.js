import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { GameConfig } from './config/GameConfig';
import { GameState } from './core/GameState';
import { EventBus } from './core/EventBus';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1b1464',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Boot, Preloader, MainMenu, Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    plugins: {
        global: [
            { key: 'GameState', plugin: GameState, start: true },
            { key: 'EventBus', plugin: EventBus, start: true }
        ]
    },
    callbacks: {
        postBoot: function(game) {
            // Initialize global game state
            game.registry.set('gameState', new GameState());
            game.registry.set('eventBus', new EventBus());
            
            // Set global game configuration
            game.registry.set('config', GameConfig);
        }
    }
};

window.addEventListener('load', () => {
    // Create game instance
    const game = new Phaser.Game(config);

    // Handle window resize
    window.addEventListener('resize', () => {
        game.scale.refresh();
    });
});

export default config;
```