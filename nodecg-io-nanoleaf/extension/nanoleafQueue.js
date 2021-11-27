"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoleafQueue = void 0;
class NanoleafQueue {
    constructor() {
        this.eventQueue = [];
        this.isQueueWorkerRunning = false;
        this.isQueuePaused = false;
    }
    queueEvent(functionCall, durationInSeconds) {
        this.eventQueue.push({ functionCall, durationInSeconds });
        if (!this.isQueueWorkerRunning) {
            this.isQueueWorkerRunning = true;
            this.showNextQueueEffect();
        }
    }
    showNextQueueEffect() {
        if (this.eventQueue.length >= 1) {
            if (!this.isQueuePaused) {
                const nextEffect = this.eventQueue.shift();
                nextEffect === null || nextEffect === void 0 ? void 0 : nextEffect.functionCall();
                setTimeout(() => this.showNextQueueEffect(), ((nextEffect === null || nextEffect === void 0 ? void 0 : nextEffect.durationInSeconds) || 1) * 1000);
            }
        }
        else {
            this.isQueueWorkerRunning = false;
        }
    }
    pauseQueue() {
        this.isQueuePaused = true;
    }
    resumeQueue() {
        if (this.isQueuePaused) {
            this.isQueuePaused = false;
            this.showNextQueueEffect();
        }
    }
    isEffectActive() {
        return this.isQueueWorkerRunning;
    }
}
exports.NanoleafQueue = NanoleafQueue;
//# sourceMappingURL=nanoleafQueue.js.map