import { Board } from "./Board";

export class Renderer {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('board') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public draw(board: Board): void {
        if (!board) return;

        this.scaleToBoardSize(board);

        this.ctx.fillStyle = 'black';
        board.data.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell)
                    this.ctx.fillRect(x, y, 1, 1);
            })
        })
    }
    
    protected scaleToBoardSize(board: Board) {
        this.ctx.restore();
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.scale(this.canvas.width / board.width, this.canvas.height / board.height);
    }
}