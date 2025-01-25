export class GameState {
    constructor() {
        this.score = 0;
        this.moves = 0;
        this.comboMultiplier = 1;
        this.maxCombo = 4;
        this.status = {
            isProcessing: false,
            canMove: true,
            isPaused: false
        };
    }

    incrementScore(points) {
        this.score += points * this.comboMultiplier;
        this.comboMultiplier = Math.min(this.comboMultiplier + 0.5, this.maxCombo);
    }

    resetCombo() {
        this.comboMultiplier = 1;
    }

    makeMove() {
        return ++this.moves;
    }
}