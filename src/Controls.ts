import { Board } from "./Board";
import { Renderer } from "./Renderer";
import { SimulationLoop, SimulationSpeed } from "./SimulationLoop";
import { Theme, UI } from "./UI";

export class Controls {
    protected renderer: Renderer;
    protected simulationLoop: SimulationLoop;
    protected board: Board;
    protected ui: UI = new UI;
    protected _speed!: SimulationSpeed;

    constructor() {
        // Defaults
        this.boardWidth = 50;
        this.boardHeight = 50;
        this.speed = SimulationSpeed.FAST;

        // Initialize board
        this.board = new Board(this.boardWidth, this.boardHeight);
        this.board.randomize();

        // Initialize renderer
        this.renderer = new Renderer(this.board);
        this.renderer.start();
        this.theme = Theme.DARK;

        // Initialize simulation loop
        this.simulationLoop = new SimulationLoop(this.board, this.speed);
        this.simulationLoop.start();

        this.setUiEvents();
    }

    protected setUiEvents(): void {
        this.ui.toggle.onclick = () => this.toggle();

        this.ui.themeDark.onchange = (e) => this.theme = (e.target as any).value;
        this.ui.themeLight.onchange = (e) => this.theme = (e.target as any).value;
        this.ui.startRenderer.onclick = () => this.renderer.start();
        this.ui.stopRenderer.onclick = () => this.renderer.stop();

        this.ui.clearBoard.onclick = () => this.board.clear();
        this.ui.randomizeBoard.onclick = () => this.board.randomize();
        this.ui.boardWidth.onchange = () => this.onBoardSizeChange();
        this.ui.boardHeight.onchange = () => this.onBoardSizeChange();

        this.ui.startSimulation.onclick = () => this.simulationLoop.start();
        this.ui.stopSimulation.onclick = () => this.simulationLoop.stop();
        this.ui.stepSimulation.onclick = () => this.singleStep();
        this.ui.speed1Simulation.onclick = () => this.speed = SimulationSpeed.NORMAL;
        this.ui.speed2Simulation.onclick = () => this.speed = SimulationSpeed.FAST;
        this.ui.speed3Simulation.onclick = () => this.speed = SimulationSpeed.FASTER;
        this.ui.speed4Simulation.onclick = () => this.speed = SimulationSpeed.LUDICROUS;
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

    protected set theme(theme: Theme) {
        switch (theme) {
            case Theme.DARK:
                document.body.className = 'dark-theme'
                break;
            case Theme.LIGHT:
                document.body.className = 'light-theme'
                break;
        }

        let style = getComputedStyle(document.body);
        this.renderer.colors = {
            active: style.getPropertyValue('--activeCell'),
            highlighted: style.getPropertyValue('--highlightedCell'),
            prefab: style.getPropertyValue('--prefabCell'),
        }
    }

    protected toggle() {
        if (this.ui.controls) {
            if (this.ui.controls.className === 'hidden')
                this.ui.controls.className = '';
            else
                this.ui.controls.className = 'hidden';
        }
    }

    protected singleStep(): void {
        this.simulationLoop.stop();
        this.board.step();
    }

    protected get speed() {
        return this._speed;
    }

    protected set speed(speed: SimulationSpeed) {
        this._speed = speed;
        if (this.simulationLoop) {
            this.simulationLoop.stop();
            this.simulationLoop.speed = speed;
            this.simulationLoop.start();
        }
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