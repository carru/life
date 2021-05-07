import { Board } from "./Board";
import { Controls } from "./Controls";
import { Renderer } from "./Renderer";
import { SimulationLoop } from "./SimulationLoop";

window.onload = () => {
    let board = new Board(10, 10);
    
    let renderer = new Renderer();
    renderer.board = board;
    renderer.start();
    
    let simulationLoop = new SimulationLoop(board);
    simulationLoop.start();

    let controls = new Controls(renderer, simulationLoop);
}