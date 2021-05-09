/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 336:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Board = void 0;
class Board {
    constructor(width, height) {
        this.data = [];
        if (width && height)
            this.data = this.newBlankGrid(width, height);
    }
    randomize() {
        this.loopAndSetData(() => { return Math.round(Math.random()); });
    }
    clear() {
        this.loopAndSetData(() => { return 0; });
    }
    toggleCell(x, y) {
        this.data[y][x] = (this.data[y][x]) ? 0 : 1;
    }
    loopAndSetData(callback) {
        Board.loopAndSet(this.data, callback);
    }
    static loopAndSet(data, callback) {
        let width = data[0].length;
        let height = data.length;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                data[y][x] = callback(data[y][x], x, y);
            }
        }
    }
    static loop(data, callback) {
        let width = data[0].length;
        let height = data.length;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                callback(data[y][x], x, y);
            }
        }
    }
    newBlankGrid(width, height) {
        return new Array(height).fill(0).map(() => new Array(width).fill(0));
    }
    step() {
        let neighbours = this.calculateNeighbours();
        this.loopAndSetData((cell, x, y) => {
            /* Rules from wikipedia
             * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules */
            // Any live cell with two or three live neighbours survives
            if (cell && (neighbours[y][x] === 2 || neighbours[y][x] === 3))
                return 1;
            // Any dead cell with three live neighbours becomes a live cell
            else if (!cell && neighbours[y][x] === 3)
                return 1;
            // All other live cells die in the next generation. Similarly, all other dead cells stay dead
            else
                return 0;
        });
    }
    calculateNeighbours() {
        // TODO this spaghetti is embarrasing; refactor to use loopAndSet
        let width = this.width;
        let height = this.height;
        // 0 based width/height
        let w = width - 1;
        let h = height - 1;
        let neighbours = this.newBlankGrid(width, height);
        // Corners
        neighbours[0][0] =
            this.data[0][1] +
                this.data[1][0] +
                this.data[1][1];
        neighbours[h][0] =
            this.data[h][1] +
                this.data[h - 1][0] +
                this.data[h - 1][1];
        neighbours[0][w] =
            this.data[0][w - 1] +
                this.data[1][w] +
                this.data[1][w - 1];
        neighbours[h][w] =
            this.data[h][w - 1] +
                this.data[h - 1][w] +
                this.data[h - 1][w - 1];
        // Sides
        for (let y = 1; y < h; y++) {
            neighbours[y][0] =
                this.data[y - 1][0] +
                    this.data[y - 1][1] +
                    this.data[y][1] +
                    this.data[y + 1][1] +
                    this.data[y + 1][0];
            neighbours[y][w] =
                this.data[y - 1][w] +
                    this.data[y - 1][w - 1] +
                    this.data[y][w - 1] +
                    this.data[y + 1][w - 1] +
                    this.data[y + 1][w];
        }
        for (let x = 1; x < w; x++) {
            neighbours[0][x] =
                this.data[0][x - 1] +
                    this.data[1][x - 1] +
                    this.data[1][x] +
                    this.data[1][x + 1] +
                    this.data[0][x + 1];
            neighbours[h][x] =
                this.data[h][x - 1] +
                    this.data[h - 1][x - 1] +
                    this.data[h - 1][x] +
                    this.data[h - 1][x + 1] +
                    this.data[h][x + 1];
        }
        // Inside
        for (let y = 1; y < h; y++) {
            for (let x = 1; x < w; x++) {
                neighbours[y][x] =
                    this.data[y - 1][x - 1] +
                        this.data[y - 1][x] +
                        this.data[y - 1][x + 1] +
                        this.data[y][x - 1] +
                        this.data[y][x + 1] +
                        this.data[y + 1][x - 1] +
                        this.data[y + 1][x] +
                        this.data[y + 1][x + 1];
            }
        }
        return neighbours;
    }
    normalize() {
        this.loopAndSetData((cell) => { return (cell) ? 1 : 0; });
    }
    copyAndResize(width, height) {
        let oldWidth = this.width;
        let oldHeight = this.height;
        let newData = this.newBlankGrid(width, height);
        Board.loopAndSet(newData, (cell, x, y) => {
            if (x < oldWidth && y < oldHeight)
                return this.data[y][x];
            else
                return 0;
        });
        let newBoard = new Board();
        newBoard.data = newData;
        return newBoard;
    }
    get width() {
        if (!this.data)
            return 0;
        return this.data[0].length;
    }
    get height() {
        if (!this.data)
            return 0;
        return this.data.length;
    }
}
exports.Board = Board;


/***/ }),

/***/ 271:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Controls = void 0;
const Board_1 = __webpack_require__(336);
const Renderer_1 = __webpack_require__(570);
const SimulationLoop_1 = __webpack_require__(945);
const UI_1 = __webpack_require__(191);
class Controls {
    constructor() {
        this.ui = new UI_1.UI;
        // Defaults
        this.boardWidth = 50;
        this.boardHeight = 50;
        this.speed = SimulationLoop_1.SimulationSpeed.FAST;
        // Initialize board
        this.board = new Board_1.Board(this.boardWidth, this.boardHeight);
        this.board.randomize();
        // Initialize renderer
        this.renderer = new Renderer_1.Renderer(this.board);
        this.renderer.start();
        this.theme = UI_1.Theme.DARK;
        // Initialize simulation loop
        this.simulationLoop = new SimulationLoop_1.SimulationLoop(this.board, this.speed);
        this.simulationLoop.start();
        this.setUiEvents();
    }
    setUiEvents() {
        this.ui.toggle.onclick = () => this.toggle();
        this.ui.themeDark.onchange = (e) => this.theme = e.target.value;
        this.ui.themeLight.onchange = (e) => this.theme = e.target.value;
        this.ui.startRenderer.onclick = () => this.renderer.start();
        this.ui.stopRenderer.onclick = () => this.renderer.stop();
        this.ui.clearBoard.onclick = () => this.board.clear();
        this.ui.randomizeBoard.onclick = () => this.board.randomize();
        this.ui.boardWidth.onchange = () => this.onBoardSizeChange();
        this.ui.boardHeight.onchange = () => this.onBoardSizeChange();
        this.ui.startSimulation.onclick = () => this.simulationLoop.start();
        this.ui.stopSimulation.onclick = () => this.simulationLoop.stop();
        this.ui.stepSimulation.onclick = () => this.singleStep();
        this.ui.speed1Simulation.onclick = () => this.speed = SimulationLoop_1.SimulationSpeed.NORMAL;
        this.ui.speed2Simulation.onclick = () => this.speed = SimulationLoop_1.SimulationSpeed.FAST;
        this.ui.speed3Simulation.onclick = () => this.speed = SimulationLoop_1.SimulationSpeed.FASTER;
        this.ui.speed4Simulation.onclick = () => this.speed = SimulationLoop_1.SimulationSpeed.LUDICROUS;
    }
    get boardWidth() {
        return Number(this.ui.boardWidth.value);
    }
    set boardWidth(boardWidth) {
        this.ui.boardWidth.value = String(boardWidth);
    }
    get boardHeight() {
        return Number(this.ui.boardHeight.value);
    }
    set boardHeight(boardHeight) {
        this.ui.boardHeight.value = String(boardHeight);
    }
    set theme(theme) {
        switch (theme) {
            case UI_1.Theme.DARK:
                document.body.className = 'dark-theme';
                break;
            case UI_1.Theme.LIGHT:
                document.body.className = 'light-theme';
                break;
        }
        let style = getComputedStyle(document.body);
        this.renderer.colors = {
            active: style.getPropertyValue('--activeCell'),
            highlighted: style.getPropertyValue('--highlightedCell'),
            prefab: style.getPropertyValue('--prefabCell'),
        };
    }
    toggle() {
        if (this.ui.controls) {
            if (this.ui.controls.className === 'hidden')
                this.ui.controls.className = '';
            else
                this.ui.controls.className = 'hidden';
        }
    }
    singleStep() {
        this.simulationLoop.stop();
        this.board.step();
    }
    get speed() {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
        if (this.simulationLoop) {
            this.simulationLoop.stop();
            this.simulationLoop.speed = speed;
            this.simulationLoop.start();
        }
    }
    onBoardSizeChange() {
        this.replaceBoard(this.board.copyAndResize(this.boardWidth, this.boardHeight));
    }
    replaceBoard(newBoard) {
        this.board = newBoard;
        this.renderer.board = newBoard;
        let simWasRunning = this.simulationLoop.isRunning();
        this.simulationLoop.stop();
        this.simulationLoop = new SimulationLoop_1.SimulationLoop(newBoard, this.speed);
        if (simWasRunning)
            this.simulationLoop.start();
    }
}
exports.Controls = Controls;


/***/ }),

/***/ 570:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderer = void 0;
const Board_1 = __webpack_require__(336);
class Renderer {
    constructor(board) {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        if (board)
            this.board = board;
        this.canvas.onmousemove = (e) => this.onMouseMove(e.clientX, e.clientY);
        this.canvas.onclick = () => this.onMouseClick();
    }
    start() {
        this.requestID = window.requestAnimationFrame(() => this.draw());
    }
    stop() {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
            this.requestID = undefined;
        }
    }
    onMouseMove(x, y) {
        if (this.scaleFactorX && this.scaleFactorY) {
            this.highlightedCellX = Math.floor(x / this.scaleFactorX);
            this.highlightedCellY = Math.floor(y / this.scaleFactorY);
        }
    }
    onMouseClick() {
        if (this.board && this.highlightedCellX !== undefined && this.highlightedCellY !== undefined)
            this.board.toggleCell(this.highlightedCellX, this.highlightedCellY);
    }
    draw() {
        if (!this.board)
            return;
        this.scaleToBoardSize();
        // Draw active cells
        this.ctx.fillStyle = this.colors.active;
        Board_1.Board.loop(this.board.data, (cell, x, y) => {
            if (cell)
                this.ctx.fillRect(x, y, 1, 1);
        });
        // Draw highlighted cell
        if (this.highlightedCellX !== undefined && this.highlightedCellY !== undefined) {
            this.ctx.fillStyle = this.colors.highlighted;
            this.ctx.fillRect(this.highlightedCellX, this.highlightedCellY, 1, 1);
        }
        this.requestID = window.requestAnimationFrame(() => this.draw());
    }
    scaleToBoardSize() {
        if (!this.board)
            return;
        this.ctx.restore();
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.scaleFactorX = this.canvas.width / this.board.width;
        this.scaleFactorY = this.canvas.height / this.board.height;
        this.ctx.scale(this.scaleFactorX, this.scaleFactorY);
    }
}
exports.Renderer = Renderer;


/***/ }),

/***/ 945:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimulationLoop = exports.SimulationSpeed = void 0;
var SimulationSpeed;
(function (SimulationSpeed) {
    SimulationSpeed[SimulationSpeed["NORMAL"] = 1000] = "NORMAL";
    SimulationSpeed[SimulationSpeed["FAST"] = 400] = "FAST";
    SimulationSpeed[SimulationSpeed["FASTER"] = 100] = "FASTER";
    SimulationSpeed[SimulationSpeed["LUDICROUS"] = 0] = "LUDICROUS";
})(SimulationSpeed = exports.SimulationSpeed || (exports.SimulationSpeed = {}));
class SimulationLoop {
    constructor(board, speed) {
        this.speed = SimulationSpeed.NORMAL;
        this.board = board;
        this.speed = speed;
    }
    start() {
        if (!this.intervalID)
            this.intervalID = setInterval(() => this.loop(), this.speed);
    }
    stop() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = undefined;
        }
    }
    isRunning() {
        return this.intervalID !== undefined;
    }
    loop() {
        this.board.step();
    }
}
exports.SimulationLoop = SimulationLoop;


/***/ }),

/***/ 191:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UI = exports.Theme = void 0;
var Theme;
(function (Theme) {
    Theme["DARK"] = "1";
    Theme["LIGHT"] = "2";
})(Theme = exports.Theme || (exports.Theme = {}));
class UI {
    constructor() {
        this.toggle = document.getElementById('toggle-controls-btn');
        this.controls = document.getElementById('controls');
        // Renderer
        this.themeDark = document.getElementById('dark-theme-radio');
        this.themeLight = document.getElementById('light-theme-radio');
        this.startRenderer = document.getElementById('start-renderer-btn');
        this.stopRenderer = document.getElementById('stop-renderer-btn');
        // Board
        this.clearBoard = document.getElementById('clear-board-btn');
        this.randomizeBoard = document.getElementById('randomize-board-btn');
        this.boardWidth = document.getElementById('board-width');
        this.boardHeight = document.getElementById('board-height');
        // Simulation
        this.startSimulation = document.getElementById('start-simulation-btn');
        this.stopSimulation = document.getElementById('stop-simulation-btn');
        this.stepSimulation = document.getElementById('step-simulation-btn');
        this.speed1Simulation = document.getElementById('simulation-speed-1-btn');
        this.speed2Simulation = document.getElementById('simulation-speed-2-btn');
        this.speed3Simulation = document.getElementById('simulation-speed-3-btn');
        this.speed4Simulation = document.getElementById('simulation-speed-4-btn');
    }
}
exports.UI = UI;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var exports = {};
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const Controls_1 = __webpack_require__(271);
window.onload = () => {
    new Controls_1.Controls();
};

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
// extracted by mini-css-extract-plugin

})();

/******/ })()
;