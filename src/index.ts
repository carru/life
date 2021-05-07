import { Board } from "./Board";
import { Renderer } from "./Renderer";

window.onload = () => {
    let renderer = new Renderer;

    let board = new Board();
    board.data = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ];

    renderer.draw(board);
}