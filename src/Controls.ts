import $ from "jquery";
import { Board } from "./Board";
import { Renderer } from "./Renderer";
import { SimulationLoop, SimulationSpeed } from "./SimulationLoop";

export class Controls {
    protected _renderer!: Renderer;
    protected _simulationLoop!: SimulationLoop;
    protected _boardWidth!: number;
    protected _boardHeight!: number;
    protected speed: SimulationSpeed;
    protected board: Board;

    constructor() {
        $("#toggle-controls-btn").on("click", () => this.toggle());
        this.boardWidth = 50;
        this.boardHeight = 50;
        $("#board-width").on("change", () => this.updateBoardSize());
        $("#board-height").on("change", () => this.updateBoardSize());

        this.board = new Board(this.boardWidth, this.boardHeight);

        this.renderer = new Renderer(this.board);
        this.renderer.start();

        this.speed = SimulationSpeed.NORMAL;
        this.simulationLoop = new SimulationLoop(this.board, this.speed);
        this.simulationLoop.start();
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

    protected get renderer() {
        return this._renderer;
    }

    protected set renderer(renderer: Renderer) {
        this._renderer = renderer;
        $("#start-renderer-btn").on("click", () => this._renderer.start());
        $("#stop-renderer-btn").on("click", () => this._renderer.stop());
    }

    protected get simulationLoop() {
        return this._simulationLoop;
    }

    protected set simulationLoop(simulationLoop: SimulationLoop) {
        this._simulationLoop = simulationLoop;
        $("#start-simulation-btn").on("click", () => this._simulationLoop.start());
        $("#stop-simulation-btn").on("click", () => this._simulationLoop.stop());
        $("#simulation-speed-1-btn").on("click", () => this.updateSpeed(SimulationSpeed.NORMAL));
        $("#simulation-speed-2-btn").on("click", () => this.updateSpeed(SimulationSpeed.FAST));
        $("#simulation-speed-3-btn").on("click", () => this.updateSpeed(SimulationSpeed.FASTER));
        $("#simulation-speed-4-btn").on("click", () => this.updateSpeed(SimulationSpeed.LUDICROUS));
    }

    protected toggle() {
        $("#controls").toggle();
    }

    protected updateSpeed(speed: SimulationSpeed): void {
        this.speed = speed;
        this._simulationLoop.stop();
        this._simulationLoop.speed = this.speed;
        this._simulationLoop.start();
    }

    protected updateBoardSize(): void {
        this._boardWidth = Number($("#board-width").val());
        this._boardHeight = Number($("#board-height").val());

        this.replaceBoard(this.board.copyAndResize(this.boardWidth, this.boardHeight));
    }

    protected replaceBoard(newBoard: Board): void {
        this.board = newBoard;

        this.renderer.board = newBoard;
        
        let simWasRunning: boolean = this.simulationLoop.isRunning();
        this.simulationLoop.stop();
        this.simulationLoop = new SimulationLoop(newBoard, this.speed);
        if (simWasRunning)
            this.simulationLoop.start();
    }
}