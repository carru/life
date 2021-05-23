import { Board } from "./Board";
import { UI } from "./UI";
import { WebGLUtils } from "./WebGLUtils";

interface Colors {
    active: string,
    highlighted: string,
    prefab: string
}

interface BoardProgram {
    program: WebGLProgram,
    a_positionLoc: number,
    a_maskLoc: number,
    u_colorLoc: WebGLUniformLocation,
    vao: WebGLVertexArrayObject
}

interface BoardVerticesBuffer {
    vertices: number[],
    buffer: WebGLBuffer
}

export class GpuRenderer {
    protected _board: Board | undefined;
    public _colors!: Colors;
    public activePrefab: number[][] | undefined;
    protected gl: WebGL2RenderingContext;
    protected boardProgram: BoardProgram;
    protected boardVertices: BoardVerticesBuffer;
    protected boardMask: BoardVerticesBuffer;
    protected maskLastUpdated: number;
    protected requestID: number | undefined;
    protected prevTimestamp: number;

    constructor(board?: Board) {
        this.gl = UI.canvas.getContext('webgl2') as WebGL2RenderingContext;

        // init gl programs
        const program = WebGLUtils.createProgram(this.gl, require('./shaders/board.vert'), require('./shaders/board.frag'));
        this.boardProgram = {
            program,
            a_positionLoc: this.gl.getAttribLocation(program, "a_position"),
            a_maskLoc: this.gl.getAttribLocation(program, "a_mask"),
            u_colorLoc: this.gl.getUniformLocation(program, "u_color"),
            vao: this.gl.createVertexArray()
        }
        this.gl.bindVertexArray(this.boardProgram.vao);
        this.gl.enableVertexAttribArray(this.boardProgram.a_positionLoc);
        this.gl.enableVertexAttribArray(this.boardProgram.a_maskLoc);
        this.gl = UI.canvas.getContext('webgl2') as WebGL2RenderingContext;

        if (board)
            this.board = board;
    }

    public get board() {
        return this._board;
    }

    public set board(board: Board) {
        this._board = board;
        this.updateBoardGridVerticesBuffer();
    }

    public get colors() {
        return this._colors;
    }

    public set colors(colors: Colors) {
        this._colors = colors;
        this.updateColorUniforms();
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

    protected updateColorUniforms(): void {
        this.setColorUniform(this.boardProgram.program, this.boardProgram.u_colorLoc, this.colors.active);
    }

    protected setColorUniform(program: WebGLProgram, uLoc: WebGLUniformLocation, rgbaString: string): void {
        this.gl.useProgram(program);
        const color = this.rgba2Components(rgbaString);
        this.gl.uniform4f(uLoc, color[0], color[1], color[2], color[3]);
    }

    protected rgba2Components(rgbaString: string): number[] {
        const matches = rgbaString.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d*)\)/);
        return [Number.parseFloat(matches[1]), Number.parseFloat(matches[2]), Number.parseFloat(matches[3]), Number.parseFloat(matches[4])];
    }

    protected updateMaskBuffer(): void {
        // Clear previous buffer, if any
        if (this.boardMask) {
            this.gl.deleteBuffer(this.boardMask.buffer);
            delete this.boardMask;
        }

        this.boardMask = {
            vertices: this.activeCellMask,
            buffer: this.gl.createBuffer()
        }
        this.gl.bindVertexArray(this.boardProgram.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boardMask.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.boardMask.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.boardProgram.a_maskLoc, 1, this.gl.FLOAT, false, 0, 0);

        this.maskLastUpdated = this.board.lastUpdated;
    }

    protected updateBoardGridVerticesBuffer(): void {
        // Clear previous buffer, if any
        if (this.boardVertices) {
            this.gl.deleteBuffer(this.boardVertices.buffer);
            delete this.boardVertices;
        }

        this.boardVertices = {
            // vertices: this.activeCellVertices,
            vertices: this.allVertices,
            buffer: this.gl.createBuffer()
        }
        this.gl.bindVertexArray(this.boardProgram.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boardVertices.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.boardVertices.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.boardProgram.a_positionLoc, 2, this.gl.FLOAT, false, 0, 0);
    }

    protected draw(timestamp: number): void {
        if (!this.board) return;

        const frametime = timestamp - this.prevTimestamp;
        const fps = 1 / (frametime / 1000);
        UI.setRenderStatsText(frametime, fps);
        this.prevTimestamp = timestamp;

        this.resizeCanvasToDisplaySize();

        // Clear canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Calculate mask and save to buffer; only if board has changed
        if (this.maskLastUpdated !== this.board.lastUpdated)
            this.updateMaskBuffer();

        // Draw active cells
        this.gl.useProgram(this.boardProgram.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.boardVertices.vertices.length / 2);

        this.requestID = window.requestAnimationFrame((timestamp) => this.draw(timestamp));
    }

    protected get activeCellMask(): number[] {
        let mask = [];
        this.board.loopData((cell) => {
            mask.push(...[cell, cell, cell, cell, cell, cell])
        })
        return mask;
    }

    protected get allVertices(): number[] {
        const w = this.board.width;
        const h = this.board.height;
        let vertices = [];
        this.board.loopData((cell, x, y) => {
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