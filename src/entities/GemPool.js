export class GemPool {
    constructor(scene) {
        this.scene = scene;
        this.pool = new Map();
    }

    spawn(type, x, y) {
        if (!this.pool.has(type)) {
            this.pool.set(type, []);
        }
        
        let gem = this.pool.get(type).pop() || this.createGem(type);
        gem.setPosition(x, y).setActive(true).setVisible(true);
        return gem;
    }

    despawn(gem) {
        if (!this.pool.has(gem.type)) {
            this.pool.set(gem.type, []);
        }
        this.pool.get(gem.type).push(gem);
        gem.setActive(false).setVisible(false);
    }

    createGem(type) {
        return new Gem(this.scene, 0, 0, type);
    }
}