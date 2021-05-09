import { Board } from "./Board";

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
    }

    public isRunning(): boolean {
        return this.intervalID !== undefined;
    }

    protected loop(): void {
        this.board.step();
    }
}