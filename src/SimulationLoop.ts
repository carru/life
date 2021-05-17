import { Board } from "./Board";
import { UI } from "./UI";

export enum SimulationSpeed {
    NORMAL = 1000,
    FAST = 400,
    FASTER = 100,
    LUDICROUS = 0
}

export class SimulationLoop {
    public speed: number = SimulationSpeed.NORMAL;
    protected board: Board;
    protected intervalID: NodeJS.Timeout | undefined;
    protected prevTimestamp: number;

    constructor(board: Board, speed: number) {
        this.board = board;
        this.speed = speed;
    }

    public start(): void {
        if (!this.intervalID)
            this.intervalID = setInterval(() => this.loop(), this.speed);
    }

    public stop(): void {
        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = undefined;
        }
        UI.setSimStatsText(0);
    }

    public isRunning(): boolean {
        return this.intervalID !== undefined;
    }

    protected loop(): void {
        const timestamp = performance.now();
        const loopTime = timestamp - this.prevTimestamp;
        UI.setSimStatsText(loopTime);
        this.prevTimestamp = timestamp;

        this.board.step();
    }
}