import { Board } from "./Board";
import { Controls } from "./Controls";
import { Renderer } from "./Renderer";
import { SimulationLoop } from "./SimulationLoop";

window.onload = () => {
    let controls = new Controls();

    let board = new Board(controls.boardWidth, controls.boardHeight);
    controls.board = board;
    
    let renderer = new Renderer();
    renderer.board = board;
    renderer.start();
    controls.renderer = renderer;
    
    let simulationLoop = new SimulationLoop(board);
    simulationLoop.start();
    controls.simulationLoop = simulationLoop;
}