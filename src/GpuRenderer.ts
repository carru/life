import { Board } from "./Board";
import { UI } from "./UI";
import { WebGLUtils } from "./WebGLUtils";

interface Colors {
    active: string,
    highlighted: string,
    prefab: string
}

interface Program {
    program: WebGLProgram,
    a_positionLoc: number,
    vao: WebGLVertexArrayObject
}

export class GpuRenderer {
    public board: Board | undefined;
    public colors!: Colors;
    public activePrefab: number[][] | undefined;
    protected gl: WebGL2RenderingContext;
    protected boardProgram: Program;
    protected requestID: number | undefined;
    protected prevTimestamp: number;

    constructor(board?: Board) {
        this.gl = UI.canvas.getContext('webgl2') as WebGL2RenderingContext;

        if (board) {
            this.board = board;
            // this.updateBoardGridVerticesBuffer();
        }

        // UI.canvas.onmousemove = (e) => this.onMouseMove(e.clientX, e.clientY);
        // UI.canvas.onclick = () => this.onMouseClick();

        // init gl programs
        const program = WebGLUtils.createProgram(this.gl, require('./shaders/board.vert'), require('./shaders/board.frag'));
        this.boardProgram = {
            program,
            a_positionLoc: this.gl.getAttribLocation(program, "a_position"),
            vao: this.gl.createVertexArray()
        }
        this.gl.bindVertexArray(this.boardProgram.vao);
        this.gl.enableVertexAttribArray(this.boardProgram.a_positionLoc);
    }

    public start(): void {
        this.requestID = window.requestAnimationFrame((timestamp) => this.draw(timestamp));
    }

    public stop(): void {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
            this.requestID = undefined;
        }
        UI.setRenderStatsText(0, 0);
    }

    // protected onMouseMove(x: number, y: number): void {
    // }

    // protected onMouseClick(): void {
    // }

    protected draw(timestamp: number): void {
        if (!this.board) return;

        const frametime = timestamp - this.prevTimestamp;
        const fps = 1 / (frametime / 1000);
        UI.setRenderStatsText(frametime, fps);
        this.prevTimestamp = timestamp;

        this.resizeCanvasToDisplaySize();

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        /* Computing vertices on each frame is too slow
         * need to precalculate all vertices of all cells and then use a mask or texture to display only active ones */
        const vertices = this.activeCellVertices;
        const verticesBuffer = this.gl.createBuffer();
        this.gl.bindVertexArray(this.boardProgram.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, verticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.boardProgram.a_positionLoc, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.useProgram(this.boardProgram.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length / 2);

        this.requestID = window.requestAnimationFrame((timestamp) => this.draw(timestamp));
    }

    protected get activeCellVertices() {
        const w = this.board.width;
        const h = this.board.height;
        let vertices = [];
        this.board.loopData((cell, x, y) => {
            if (cell)
                vertices.push(...[
                    x / h, y / w,
                    x / h, (y + 1) / w,
                    (x + 1) / h, y / w,
                    (x + 1) / h, y / w,
                    (x + 1) / h, (y + 1) / w,
                    x / h, (y + 1) / w
                ])
        })
        return vertices;
    }

    protected resizeCanvasToDisplaySize() {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth = UI.canvas.clientWidth;
        const displayHeight = UI.canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needsResize = UI.canvas.width !== displayWidth ||
            UI.canvas.height !== displayHeight;

        if (needsResize) {
            // Make the canvas the same size
            UI.canvas.width = displayWidth;
            UI.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        }
    }
}