import { Board } from "./Board";
import { Renderer, Theme } from "./Renderer";
import { SimulationLoop, SimulationSpeed } from "./SimulationLoop";
import { UI } from "./UI";

export class Controls {
    protected _renderer!: Renderer;
    protected _simulationLoop!: SimulationLoop;
    protected speed: SimulationSpeed;
    protected board: Board;
    protected ui: UI = new UI;

    constructor() {
        this.boardWidth = 50;
        this.boardHeight = 50;

        this.board = new Board(this.boardWidth, this.boardHeight);

        this.renderer = new Renderer(this.board);
        this.renderer.start();

        this.speed = SimulationSpeed.NORMAL;
        this.simulationLoop = new SimulationLoop(this.board, this.speed);
        this.simulationLoop.start();

        this.ui.toggle.onclick = () => this.toggle();
        this.ui.clearBoard.onclick = () => this.board.clear();
        this.ui.randomizeBoard.onclick = () => this.board.randomize();
        this.ui.stepSimulation.onclick = () => this.singleStep();
        this.ui.boardWidth.onchange = () => this.onBoardSizeChange();
        this.ui.boardHeight.onchange = () => this.onBoardSizeChange();
        this.ui.themeDark.onchange = (e) => this.onThemeChange((e.target as any).value);
        this.ui.themeLight.onchange = (e) => this.onThemeChange((e.target as any).value);
    }

    public get boardWidth() {
        return Number(this.ui.boardWidth.value);
    }

    public set boardWidth(boardWidth: number) {
        this.ui.boardWidth.value = String(boardWidth);
    }

    public get boardHeight() {
        return Number(this.ui.boardHeight.value);
    }

    public set boardHeight(boardHeight: number) {
        this.ui.boardHeight.value = String(boardHeight);
    }

    protected onThemeChange(value: string): void {
        this.theme = Number(value);
    }

    protected set theme(theme: Theme) {
        this.renderer.theme = theme;
        switch (theme) {
            case Theme.DARK:
                document.body.className = 'dark-theme'
                break;
            case Theme.LIGHT:
                document.body.className = 'light-theme'
                break;
        }
    }

    protected get renderer() {
        return this._renderer;
    }

    protected set renderer(renderer: Renderer) {
        this._renderer = renderer;
        this.ui.startRenderer.onclick = () => this._renderer.start();
        this.ui.stopRenderer.onclick = () => this._renderer.stop();
    }

    protected get simulationLoop() {
        return this._simulationLoop;
    }

    protected set simulationLoop(simulationLoop: SimulationLoop) {
        this._simulationLoop = simulationLoop;
        this.ui.startSimulation.onclick = () => this._simulationLoop.start();
        this.ui.stopSimulation.onclick = () => this._simulationLoop.stop();
        this.ui.speed1Simulation.onclick = () => this.updateSpeed(SimulationSpeed.NORMAL);
        this.ui.speed2Simulation.onclick = () => this.updateSpeed(SimulationSpeed.FAST);
        this.ui.speed3Simulation.onclick = () => this.updateSpeed(SimulationSpeed.FASTER);
        this.ui.speed4Simulation.onclick = () => this.updateSpeed(SimulationSpeed.LUDICROUS);
    }

    protected toggle() {
        if (this.ui.controls) {
            if (this.ui.controls.style.visibility === 'hidden')
                this.ui.controls.style.visibility = 'visible';
            else
                this.ui.controls.style.visibility = 'hidden';
        }
    }

    protected singleStep(): void {
        this.simulationLoop.stop();
        this.board.step();
    }

    protected updateSpeed(speed: SimulationSpeed): void {
        this.speed = speed;
        this.simulationLoop.stop();
        this.simulationLoop.speed = this.speed;
        this.simulationLoop.start();
    }

    protected onBoardSizeChange(): void {
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