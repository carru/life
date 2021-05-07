import $ from "jquery";
import { Renderer } from "./Renderer";
import { SimulationLoop } from "./SimulationLoop";

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
    }

    protected toggle() {
        $("#controls").toggle();
    }
}