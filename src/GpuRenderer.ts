import { Board } from "./Board";
import { UI } from "./UI";
import { WebGLUtils } from "./WebGLUtils";

interface Colors {
    active: string,
    highlighted: string,
    prefab: string
}

interface ActiveCellsProgram {
    program: WebGLProgram,
    a_positionLoc: number,
    a_maskLoc: number,
    u_colorLoc: WebGLUniformLocation,
    vao: WebGLVertexArrayObject,
    positions: BoardVerticesBuffer,
    mask: BoardVerticesBuffer
}

interface HighlightedCellProgram {
    program: WebGLProgram,
    a_positionLoc: number,
    u_colorLoc: WebGLUniformLocation,
    vao: WebGLVertexArrayObject,
    positions: BoardVerticesBuffer
}

interface BoardVerticesBuffer {
    vertices: number[],
    buffer: WebGLBuffer
}

export class GpuRenderer {
    public activePrefab: number[][] | undefined;

    protected _board: Board | undefined;
    protected _colors!: Colors;

    protected gl: WebGL2RenderingContext;
    protected activeCellsProgram: ActiveCellsProgram;
    protected highlightedCellProgram: HighlightedCellProgram;
    protected maskLastUpdated: number;

    protected requestID: number | undefined;
    protected prevTimestamp: number;

    protected scaleFactorX: number | undefined;
    protected scaleFactorY: number | undefined;
    protected highlightedCellX: number | undefined;
    protected highlightedCellY: number | undefined;

    constructor(board?: Board) {
        this.gl = UI.canvas.getContext('webgl2') as WebGL2RenderingContext;

        // init gl programs
        let program = WebGLUtils.createProgram(this.gl, require('./shaders/activeCells.vert'), require('./shaders/colorPassthrough.frag'));
        this.activeCellsProgram = {
            program,
            a_positionLoc: this.gl.getAttribLocation(program, "a_position"),
            a_maskLoc: this.gl.getAttribLocation(program, "a_mask"),
            u_colorLoc: this.gl.getUniformLocation(program, "u_color"),
            vao: this.gl.createVertexArray(),
            positions: undefined,
            mask: undefined
        }
        this.gl.bindVertexArray(this.activeCellsProgram.vao);
        this.gl.enableVertexAttribArray(this.activeCellsProgram.a_positionLoc);
        this.gl.enableVertexAttribArray(this.activeCellsProgram.a_maskLoc);

        program = WebGLUtils.createProgram(this.gl, require('./shaders/highlightedCell.vert'), require('./shaders/colorPassthrough.frag'));
        this.highlightedCellProgram = {
            program,
            a_positionLoc: this.gl.getAttribLocation(program, "a_position"),
            u_colorLoc: this.gl.getUniformLocation(program, "u_color"),
            vao: this.gl.createVertexArray(),
            positions: undefined
        }
        this.gl.bindVertexArray(this.highlightedCellProgram.vao);
        this.gl.enableVertexAttribArray(this.highlightedCellProgram.a_positionLoc);

        if (board)
            this.board = board;

        UI.canvas.onmousemove = (e) => this.onMouseMove(e.clientX, e.clientY);
        UI.canvas.onclick = () => this.onMouseClick();
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

    protected onMouseMove(x: number, y: number): void {
        if (this.scaleFactorX && this.scaleFactorY) {
            this.highlightedCellX = Math.floor(x / this.scaleFactorX);
            this.highlightedCellY = Math.floor(y / this.scaleFactorY);
            this.updateHighlightedCellBuffer(this.highlightedCellX, this.highlightedCellY);
        }
    }

    protected onMouseClick(): void {
        if (!this.board) return;
        if (!this.highlightedCellX || !this.highlightedCellY) return;

        if (this.activePrefab) {
            this.board.insertPrefab(this.highlightedCellX, this.highlightedCellY, this.activePrefab);
            this.activePrefab = undefined;
        }
        else
            this.board.toggleCell(this.highlightedCellX, this.highlightedCellY);
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
        this.setColorUniform(this.activeCellsProgram.program, this.activeCellsProgram.u_colorLoc, this.colors.active);
        this.setColorUniform(this.highlightedCellProgram.program, this.highlightedCellProgram.u_colorLoc, this.colors.highlighted);
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

    protected updateHighlightedCellBuffer(x: number, y: number): void {
        // Clear previous buffer, if any
        if (this.highlightedCellProgram.positions) {
            this.gl.deleteBuffer(this.highlightedCellProgram.positions.buffer);
            delete this.highlightedCellProgram.positions;
        }

        this.highlightedCellProgram.positions = {
            vertices: this.getCellVertices(x, y),
            buffer: this.gl.createBuffer()
        }
        this.gl.bindVertexArray(this.highlightedCellProgram.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.highlightedCellProgram.positions.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.highlightedCellProgram.positions.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.highlightedCellProgram.a_positionLoc, 2, this.gl.FLOAT, false, 0, 0);
    }

    protected updateMaskBuffer(): void {
        // Clear previous buffer, if any
        if (this.activeCellsProgram.mask) {
            this.gl.deleteBuffer(this.activeCellsProgram.mask.buffer);
            delete this.activeCellsProgram.mask;
        }

        this.activeCellsProgram.mask = {
            vertices: this.activeCellMask,
            buffer: this.gl.createBuffer()
        }
        this.gl.bindVertexArray(this.activeCellsProgram.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.activeCellsProgram.mask.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.activeCellsProgram.mask.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.activeCellsProgram.a_maskLoc, 1, this.gl.FLOAT, false, 0, 0);

        this.maskLastUpdated = this.board.lastUpdated;
    }

    protected updateBoardGridVerticesBuffer(): void {
        // Clear previous buffer, if any
        if (this.activeCellsProgram.positions) {
            this.gl.deleteBuffer(this.activeCellsProgram.positions.buffer);
            delete this.activeCellsProgram.positions;
        }

        this.activeCellsProgram.positions = {
            vertices: this.allVertices,
            buffer: this.gl.createBuffer()
        }
        this.gl.bindVertexArray(this.activeCellsProgram.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.activeCellsProgram.positions.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.activeCellsProgram.positions.vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.activeCellsProgram.a_positionLoc, 2, this.gl.FLOAT, false, 0, 0);
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
        if (this.activeCellsProgram.positions) {
            this.gl.bindVertexArray(this.activeCellsProgram.vao);
            this.gl.useProgram(this.activeCellsProgram.program);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.activeCellsProgram.positions.vertices.length / 2);
        }

        // Draw highlighted cell
        if (this.highlightedCellProgram.positions) {
            this.gl.bindVertexArray(this.highlightedCellProgram.vao);
            this.gl.useProgram(this.highlightedCellProgram.program);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.highlightedCellProgram.positions.vertices.length / 2);
        }

        this.requestID = window.requestAnimationFrame((timestamp) => this.draw(timestamp));
    }

    protected get activeCellMask(): number[] {
        let mask = [];
        this.board.loopData((cell) => {
            mask.push(...[cell, cell, cell, cell, cell, cell]);
        })
        return mask;
    }

    protected get allVertices(): number[] {
        const w = this.board.width;
        const h = this.board.height;
        let vertices = [];
        this.board.loopData((cell, x, y) => {
            vertices.push(...this.getCellVertices(x, y));
        })
        return vertices;
    }

    protected getCellVertices(x: number, y: number): number[] {
        const w = this.board.width;
        const h = this.board.height;
        return [
            x / h, y / w,
            x / h, (y + 1) / w,
            (x + 1) / h, y / w,
            (x + 1) / h, y / w,
            (x + 1) / h, (y + 1) / w,
            x / h, (y + 1) / w
        ];
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

            // Keep track of scale factors to convert from pixel coordinates back to cell coordinates
            this.scaleFactorX = UI.canvas.width / this.board.width;
            this.scaleFactorY = UI.canvas.height / this.board.height;
        }
    }
}