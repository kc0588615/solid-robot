export class EventBus {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }
}

export const GameEvents = {
    MATCH_FOUND: 'matchFound',
    GEMS_FALLING: 'gemsFalling',
    COMBO_ACHIEVED: 'comboAchieved',
    SCORE_UPDATED: 'scoreUpdated'
};