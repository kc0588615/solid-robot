import { Scene } from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { GameState } from '../core/GameState';
import { EventBus, GameEvents } from '../core/EventBus';
import { InputHandler } from '../systems/input/InputHandler';
import { MatchFinder } from '../systems/match/MatchFinder';
import { GemPool } from '../entities/GemPool';
import { Gem } from '../entities/Gem';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.gameState = new GameState();
        this.eventBus = new EventBus();
    }

    create() {
        // Debug log
        console.log("Game Scene Started");  

        this.gemPool = new GemPool(this);
        this.grid = Array(GameConfig.GRID.WIDTH).fill().map(() => Array(GameConfig.GRID.HEIGHT));
        this.inputHandler = new InputHandler(this);
        
        // Add this logging
        console.log("Grid Created:", this.grid);


        this.setupEvents();
        this.createBoard();
        
        // Add UI text
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.movesText = this.add.text(10, 50, 'Moves: 0', { fontSize: '32px', fill: '#fff' });
    }

    setupEvents() {
        this.eventBus.on(GameEvents.MATCH_FOUND, this.handleMatches.bind(this));
        this.eventBus.on(GameEvents.GEMS_FALLING, this.handleFalling.bind(this));
        this.eventBus.on(GameEvents.SCORE_UPDATED, this.updateScore.bind(this));
    }

    createBoard() {
        for (let x = 0; x < GameConfig.GRID.WIDTH; x++) {
            for (let y = 0; y < GameConfig.GRID.HEIGHT; y++) {
                const gemType = this.getRandomGemType();
                const xPos = GameConfig.BOARD_OFFSET.X + x * GameConfig.GRID.CELL_SIZE;
                const yPos = GameConfig.BOARD_OFFSET.Y + y * GameConfig.GRID.CELL_SIZE;
                
                const gem = this.gemPool.spawn(gemType, xPos, yPos);
                gem.gridPosition = {x, y};
                this.grid[x][y] = gem;
            }
        }
        
        // Check for initial matches
        this.checkAndClearMatches();
    }

    getRandomGemType() {
        return GameConfig.GEMS.TYPES[Math.floor(Math.random() * GameConfig.GEMS.TYPES.length)];
    }

    async handleMatches(matches) {
        this.gameState.status.isProcessing = true;
        
        for (const gem of matches) {
            await gem.match();
            this.gemPool.despawn(gem);
            this.grid[gem.gridPosition.x][gem.gridPosition.y] = null;
        }
        
        await this.handleFalling();
    }

    async handleFalling() {
        const fallPromises = [];

        for (let x = 0; x < GameConfig.GRID.WIDTH; x++) {
            let fallDistance = 0;
            
            for (let y = GameConfig.GRID.HEIGHT - 1; y >= 0; y--) {
                if (!this.grid[x][y]) {
                    fallDistance++;
                    continue;
                }
                
                if (fallDistance > 0) {
                    const gem = this.grid[x][y];
                    const newY = y + fallDistance;
                    
                    this.grid[x][y] = null;
                    this.grid[x][newY] = gem;
                    gem.gridPosition.y = newY;
                    
                    const targetY = GameConfig.BOARD_OFFSET.Y + newY * GameConfig.GRID.CELL_SIZE;
                    fallPromises.push(gem.fall(targetY));
                }
            }

            // Fill empty spaces at top
            for (let y = fallDistance - 1; y >= 0; y--) {
                const gemType = this.getRandomGemType();
                const xPos = GameConfig.BOARD_OFFSET.X + x * GameConfig.GRID.CELL_SIZE;
                const startY = GameConfig.BOARD_OFFSET.Y - GameConfig.GRID.CELL_SIZE;
                const targetY = GameConfig.BOARD_OFFSET.Y + y * GameConfig.GRID.CELL_SIZE;
                
                const gem = this.gemPool.spawn(gemType, xPos, startY);
                gem.gridPosition = {x, y};
                this.grid[x][y] = gem;
                
                fallPromises.push(gem.fall(targetY));
            }
        }

        await Promise.all(fallPromises);
        
        const newMatches = MatchFinder.findMatches(this.grid);
        if (newMatches.length > 0) {
            this.eventBus.emit(GameEvents.MATCH_FOUND, newMatches);
        } else {
            this.gameState.status.isProcessing = false;
        }
    }

    updateScore(points) {
        this.gameState.incrementScore(points);
        // Update score display
    }
}