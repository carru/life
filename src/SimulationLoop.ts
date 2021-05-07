import { Board } from "./Board";

export enum SimulationSpeeds {
    NORMAL = 1000,
    FAST = 250,
    LUDICROUS = 0
}

export class SimulationLoop {
    public speed: number = SimulationSpeeds.NORMAL;
    protected board: Board;
    protected intervalID: NodeJS.Timeout | undefined;

    constructor(board: Board) {
        this.board = board;
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

    protected loop(): void {
        this.board.step();
    }
}