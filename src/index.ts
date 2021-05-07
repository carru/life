import { Renderer } from "./Renderer";

window.onload = () => {
    let renderer = new Renderer;
    let board = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ];
    renderer.draw(board);
}