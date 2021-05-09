import { Board } from "./Board";

interface Colors {
    active: string,
    highlighted: string,
    prefab: string
}

export class Renderer {
    public board: Board | undefined;
    public colors!: Colors;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected requestID: number | undefined;
    protected highlightedCellX: number | undefined;
    protected highlightedCellY: number | undefined;
    protected scaleFactorX: number | undefined;
    protected scaleFactorY: number | undefined;

    constructor(board?: Board) {
        this.canvas = document.getElementById('board') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        if (board)
            this.board = board;

        this.canvas.onmousemove = (e) => this.onMouseMove(e.clientX, e.clientY);
        this.canvas.onclick = () => this.onMouseClick();
    }

    public start(): void {
        this.requestID = window.requestAnimationFrame(() => this.draw());
    }

    public stop(): void {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
            this.requestID = undefined;
        }
    }

    protected onMouseMove(x: number, y: number): void {
        if (this.scaleFactorX && this.scaleFactorY) {
            this.highlightedCellX = Math.floor(x / this.scaleFactorX);
            this.highlightedCellY = Math.floor(y / this.scaleFactorY);
        }
    }

    protected onMouseClick(): void {
        if (this.board && this.highlightedCellX !== undefined && this.highlightedCellY !== undefined)
            this.board.toggleCell(this.highlightedCellX, this.highlightedCellY);
    }

    protected draw(): void {
        if (!this.board) return;

        this.scaleToBoardSize();

        // Draw active cells
        this.ctx.fillStyle = this.colors.active;
        Board.loop(this.board.data, (cell, x, y) => {
            if (cell)
                this.ctx.fillRect(x, y, 1, 1);
        })

        // Draw highlighted cell
        if (this.highlightedCellX !== undefined && this.highlightedCellY !== undefined) {
            this.ctx.fillStyle = this.colors.highlighted;
            this.ctx.fillRect(this.highlightedCellX, this.highlightedCellY, 1, 1);
        }

        this.requestID = window.requestAnimationFrame(() => this.draw());
    }

    protected scaleToBoardSize() {
        if (!this.board) return;

        this.ctx.restore();
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.scaleFactorX = this.canvas.width / this.board.width;
        this.scaleFactorY = this.canvas.height / this.board.height;
        this.ctx.scale(this.scaleFactorX, this.scaleFactorY);
    }
}