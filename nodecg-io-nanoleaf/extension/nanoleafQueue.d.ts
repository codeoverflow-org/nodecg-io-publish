export declare class NanoleafQueue {
    private eventQueue;
    private isQueueWorkerRunning;
    private isQueuePaused;
    queueEvent(functionCall: () => void, durationInSeconds: number): void;
    private showNextQueueEffect;
    pauseQueue(): void;
    resumeQueue(): void;
    isEffectActive(): boolean;
}
//# sourceMappingURL=nanoleafQueue.d.ts.map