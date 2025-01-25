export class InputHandler {
    constructor(scene) {
        this.scene = scene;
        this.drag = {
            active: false,
            startPos: null,
            currentGem: null,
            direction: null
        };
        this.setupInputEvents();
    }

    setupInputEvents() {
        this.scene.input.on('dragstart', this.onDragStart, this);
        this.scene.input.on('drag', this.onDrag, this);
        this.scene.input.on('dragend', this.onDragEnd, this);
    }

    onDragStart(pointer, gem) {
        if (!this.scene.gameState.status.canMove) return;
        
        this.drag = {
            active: true,
            startPos: { x: pointer.x, y: pointer.y },
            currentGem: gem,
            direction: null
        };
    }

    onDrag(pointer, gem, dragX, dragY) {
        if (!this.drag.active) return;

        const dx = pointer.x - this.drag.startPos.x;
        const dy = pointer.y - this.drag.startPos.y;

        if (!this.drag.direction && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
            this.drag.direction = Math.abs(dx) > Math.abs(dy) ? 'row' : 'column';
            this.scene.startSwap(gem, this.drag.direction);
        }
    }

    onDragEnd() {
        if (!this.drag.active) return;
        
        this.scene.completeSwap();
        this.drag = { active: false, startPos: null, currentGem: null, direction: null };
    }
}