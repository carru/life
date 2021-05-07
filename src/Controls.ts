import $ from "jquery";
import { Renderer } from "./Renderer";
import { SimulationLoop, SimulationSpeeds } from "./SimulationLoop";

export class Controls {
    protected renderer: Renderer;
    protected simulationLoop: SimulationLoop;

    constructor(renderer: Renderer, simulationLoop: SimulationLoop) {
        this.renderer = renderer;
        this.simulationLoop = simulationLoop;

        $("#toggle-controls-btn").on("click", () => this.toggle());
        $("#start-renderer-btn").on("click", () => this.renderer.start());
        $("#stop-renderer-btn").on("click", () => this.renderer.stop());
        $("#start-simulation-btn").on("click", () => this.simulationLoop.start());
        $("#stop-simulation-btn").on("click", () => this.simulationLoop.stop());
        $("#simulation-speed-1-btn").on("click", () => this.updateSpeed(SimulationSpeeds.NORMAL));
        $("#simulation-speed-2-btn").on("click", () => this.updateSpeed(SimulationSpeeds.FAST));
        $("#simulation-speed-3-btn").on("click", () => this.updateSpeed(SimulationSpeeds.LUDICROUS));
    }

    protected toggle() {
        $("#controls").toggle();
    }

    protected updateSpeed(speed: SimulationSpeeds): void {
        this.simulationLoop.stop();
        this.simulationLoop.speed = speed;
        this.simulationLoop.start();
    }
}