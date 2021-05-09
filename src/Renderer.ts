import { Board } from "./Board";

export class Renderer {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    public board!: Board;
    protected requestID: number | undefined;

    constructor(board?: Board) {
        this.canvas = document.getElementById('board') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        if (board)
            this.board = board;
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

    protected draw(): void {
        if (!this.board) return;

        this.scaleToBoardSize();

        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cell');
        Board.loop(this.board.data, (cell, x, y) => {
            if (cell)
                this.ctx.fillRect(x, y, 1, 1);
        })

        this.requestID = window.requestAnimationFrame(() => this.draw());
    }

    protected scaleToBoardSize() {
        this.ctx.restore();
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.scale(this.canvas.width / this.board.width, this.canvas.height / this.board.height);
    }
}