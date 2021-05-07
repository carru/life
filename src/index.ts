import { Board } from "./Board";
import { Controls } from "./Controls";
import { Renderer } from "./Renderer";

window.onload = () => {
    let board = new Board(10, 10);
    let renderer = new Renderer();
    let controls = new Controls(renderer);
    
    renderer.board = board;
    renderer.start();

    // mock game loop
    setInterval(() => board.step(), 1000);
}