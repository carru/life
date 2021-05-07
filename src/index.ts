import { Board } from "./Board";
import { Renderer } from "./Renderer";

window.onload = () => {
    let board = new Board(10, 10);
    
    let renderer = new Renderer();
    renderer.start(board);

    // mock game loop
    setInterval(() => board.step(), 1000);
}