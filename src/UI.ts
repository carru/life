export enum Theme {
    DARK = '1',
    LIGHT = '2'
}

export class UI {
    public settings = document.getElementById('settings-btn') as HTMLButtonElement;
    public prefabs = document.getElementById('prefabs-btn') as HTMLButtonElement;

    // Settings panel
    public controlsPanel = document.getElementById('controls') as HTMLElement ;

    // Renderer
    public themeDark = document.getElementById('dark-theme-radio') as HTMLInputElement;
    public themeLight = document.getElementById('light-theme-radio') as HTMLInputElement;
    public startRenderer = document.getElementById('start-renderer-btn') as HTMLButtonElement;
    public stopRenderer = document.getElementById('stop-renderer-btn') as HTMLButtonElement;

    // Board
    public clearBoard = document.getElementById('clear-board-btn') as HTMLButtonElement;
    public randomizeBoard = document.getElementById('randomize-board-btn') as HTMLButtonElement;
    public boardWidth = document.getElementById('board-width') as HTMLInputElement;
    public boardHeight = document.getElementById('board-height') as HTMLInputElement;

    // Simulation
    public startSimulation = document.getElementById('start-simulation-btn') as HTMLButtonElement;
    public stopSimulation = document.getElementById('stop-simulation-btn') as HTMLButtonElement;
    public stepSimulation = document.getElementById('step-simulation-btn') as HTMLButtonElement;
    public speed1Simulation = document.getElementById('simulation-speed-1-btn') as HTMLButtonElement;
    public speed2Simulation = document.getElementById('simulation-speed-2-btn') as HTMLButtonElement;
    public speed3Simulation = document.getElementById('simulation-speed-3-btn') as HTMLButtonElement;
    public speed4Simulation = document.getElementById('simulation-speed-4-btn') as HTMLButtonElement;

    // Prefabs panel
    public prefabsPanel = document.getElementById('prefabs') as HTMLElement ;
}