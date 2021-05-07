import $ from "jquery";
import { Renderer } from "./Renderer";

export class Controls {
    protected renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        $("#toggle-controls-btn").on("click", () => this.toggle());
        $("#start-renderer-btn").on("click", () => this.renderer.start());
        $("#stop-renderer-btn").on("click", () => this.renderer.stop());
    }

    protected toggle() {
        $("#controls").toggle();
    }
}