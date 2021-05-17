export enum Theme {
    DARK = '1',
    LIGHT = '2'
}

export class UI {
    public static settings = document.getElementById('settings-btn') as HTMLButtonElement;
    public static prefabs = document.getElementById('prefabs-btn') as HTMLButtonElement;

    // Settings panel
    public static controlsPanel = document.getElementById('controls-panel') as HTMLElement ;

    // Renderer
    public static stats = document.getElementById('stats') as HTMLElement;
    public static setStatsText(frametime: number, fps: number) {
        UI.stats.innerHTML = `Frametime: ${frametime.toFixed(2)} ms <br> FPS: ${fps.toFixed(2)}`;
    }
    public static themeDark = document.getElementById('dark-theme-radio') as HTMLInputElement;
    public static themeLight = document.getElementById('light-theme-radio') as HTMLInputElement;
    public static startRenderer = document.getElementById('start-renderer-btn') as HTMLButtonElement;
    public static stopRenderer = document.getElementById('stop-renderer-btn') as HTMLButtonElement;

    // Board
    public static clearBoard = document.getElementById('clear-board-btn') as HTMLButtonElement;
    public static randomizeBoard = document.getElementById('randomize-board-btn') as HTMLButtonElement;
    public static boardWidth = document.getElementById('board-width') as HTMLInputElement;
    public static boardHeight = document.getElementById('board-height') as HTMLInputElement;

    // Simulation
    public static startSimulation = document.getElementById('start-simulation-btn') as HTMLButtonElement;
    public static stopSimulation = document.getElementById('stop-simulation-btn') as HTMLButtonElement;
    public static stepSimulation = document.getElementById('step-simulation-btn') as HTMLButtonElement;
    public static speed1Simulation = document.getElementById('simulation-speed-1-btn') as HTMLButtonElement;
    public static speed2Simulation = document.getElementById('simulation-speed-2-btn') as HTMLButtonElement;
    public static speed3Simulation = document.getElementById('simulation-speed-3-btn') as HTMLButtonElement;
    public static speed4Simulation = document.getElementById('simulation-speed-4-btn') as HTMLButtonElement;
    
    // Prefabs panel
    public static prefabsPanel = document.getElementById('prefabs-panel') as HTMLElement ;

    public static cancelPrefab = document.getElementById('cancel-prefab-btn') as HTMLButtonElement;
    // Prefabs
    public static prefabGlider = document.getElementById('prefab-glider-btn') as HTMLButtonElement;
    public static prefabGosper = document.getElementById('prefab-gosper-btn') as HTMLButtonElement;
}