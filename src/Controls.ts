import { Board } from "./Board";
import { GpuRenderer } from "./GpuRenderer";
import { Prefabs } from "./Prefabs";
import { Renderer } from "./Renderer";
import { SimulationLoop, SimulationSpeed } from "./SimulationLoop";
import { Theme, UI } from "./UI";

export class Controls {
    protected renderer: Renderer | GpuRenderer;
    protected simulationLoop: SimulationLoop;
    protected board: Board;
    protected _speed!: SimulationSpeed;

    constructor() {
        // Defaults
        this.boardWidth = 500;
        this.boardHeight = 500;
        this.speed = SimulationSpeed.FAST;

        // Initialize board
        this.board = new Board(this.boardWidth, this.boardHeight);
        this.board.randomize();

        // Initialize renderer
        this.renderer = new GpuRenderer(this.board);
        this.renderer.start();
        this.theme = Theme.DARK;

        // Initialize simulation loop
        this.simulationLoop = new SimulationLoop(this.board, this.speed);
        this.simulationLoop.start();

        this.setUiEvents();
    }

    protected setUiEvents(): void {
        UI.settings.onclick = () => this.togglePanelDisplay(UI.controlsPanel);
        UI.prefabs.onclick = () => this.togglePanelDisplay(UI.prefabsPanel);

        UI.themeDark.onchange = (e) => this.theme = (e.target as any).value;
        UI.themeLight.onchange = (e) => this.theme = (e.target as any).value;
        UI.startRenderer.onclick = () => this.renderer.start();
        UI.stopRenderer.onclick = () => this.renderer.stop();

        UI.clearBoard.onclick = () => this.board.clear();
        UI.randomizeBoard.onclick = () => this.board.randomize();
        UI.boardWidth.onchange = () => this.onBoardSizeChange();
        UI.boardHeight.onchange = () => this.onBoardSizeChange();

        UI.startSimulation.onclick = () => this.simulationLoop.start();
        UI.stopSimulation.onclick = () => this.simulationLoop.stop();
        UI.stepSimulation.onclick = () => this.singleStep();
        UI.speed1Simulation.onclick = () => this.speed = SimulationSpeed.NORMAL;
        UI.speed2Simulation.onclick = () => this.speed = SimulationSpeed.FAST;
        UI.speed3Simulation.onclick = () => this.speed = SimulationSpeed.FASTER;
        UI.speed4Simulation.onclick = () => this.speed = SimulationSpeed.LUDICROUS;

        UI.cancelPrefab.onclick = () => this.renderer.activePrefab = undefined;
        UI.prefabGlider.onclick = () => this.renderer.activePrefab = Prefabs.glider;
        UI.prefabGosper.onclick = () => this.renderer.activePrefab = Prefabs.gosper;
    }

    public get boardWidth() {
        return Number(UI.boardWidth.value);
    }

    public set boardWidth(boardWidth: number) {
        UI.boardWidth.value = String(boardWidth);
    }

    public get boardHeight() {
        return Number(UI.boardHeight.value);
    }

    public set boardHeight(boardHeight: number) {
        UI.boardHeight.value = String(boardHeight);
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

    protected togglePanelDisplay(panel: HTMLElement) {
        panel.classList.toggle('hidden');
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