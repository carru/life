import $ from "jquery";
import { Board } from "./Board";
import { Renderer } from "./Renderer";
import { SimulationLoop, SimulationSpeeds } from "./SimulationLoop";

export class Controls {
    protected _renderer!: Renderer;
    protected _simulationLoop!: SimulationLoop;
    protected _board!: Board;
    protected _boardWidth!: number;
    protected _boardHeight!: number;

    constructor() {
        $("#toggle-controls-btn").on("click", () => this.toggle());
        this.boardWidth = 10;
        this.boardHeight = 10;
        $("#board-width").on("change", () => this.updateBoardSize());
        $("#board-height").on("change", () => this.updateBoardSize());
    }

    public get boardWidth() {
        return this._boardWidth;
    }

    public set boardWidth(boardWidth: number) {
        if (boardWidth > 0) {
            this._boardWidth = boardWidth;
            $("#board-width").val(boardWidth);
        }
    }

    public get boardHeight() {
        return this._boardHeight;
    }

    public set boardHeight(boardHeight: number) {
        if (boardHeight > 0) {
            this._boardHeight = boardHeight;
            $("#board-height").val(boardHeight);
        }
    }

    public set board(board: Board) {
        this._board = board;
    }

    public set renderer(renderer: Renderer) {
        this._renderer = renderer;
        $("#start-renderer-btn").on("click", () => this._renderer.start());
        $("#stop-renderer-btn").on("click", () => this._renderer.stop());
    }

    public set simulationLoop(simulationLoop: SimulationLoop) {
        this._simulationLoop = simulationLoop;
        $("#start-simulation-btn").on("click", () => this._simulationLoop.start());
        $("#stop-simulation-btn").on("click", () => this._simulationLoop.stop());
        $("#simulation-speed-1-btn").on("click", () => this.updateSpeed(SimulationSpeeds.NORMAL));
        $("#simulation-speed-2-btn").on("click", () => this.updateSpeed(SimulationSpeeds.FAST));
        $("#simulation-speed-3-btn").on("click", () => this.updateSpeed(SimulationSpeeds.LUDICROUS));
    }

    protected toggle() {
        $("#controls").toggle();
    }

    protected updateSpeed(speed: SimulationSpeeds): void {
        this._simulationLoop.stop();
        this._simulationLoop.speed = speed;
        this._simulationLoop.start();
    }

    protected updateBoardSize(): void {
        this._boardWidth = Number($("#board-width").val());
        this._boardHeight = Number($("#board-height").val());
        if (this._board)
            this._board.resize(this.boardWidth, this.boardHeight);
    }
}