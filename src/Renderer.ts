import { Board } from "./Board";

export class Renderer {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    public board!: Board;
    protected stopFlag: boolean = false;

    constructor(board?: Board) {
        this.canvas = document.getElementById('board') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        if (board)
            this.board = board;
    }

    public start(): void {
        window.requestAnimationFrame(() => this.draw());
    }

    public stop(): void {
        this.stopFlag = true;
    }

    protected draw(): void {
        if (this.stopFlag) {
            this.stopFlag = false;
            return;
        }

        if (!this.board) return;

        this.scaleToBoardSize();

        this.ctx.fillStyle = 'black';
        this.board.data.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell)
                    this.ctx.fillRect(x, y, 1, 1);
            })
        })
        
        window.requestAnimationFrame(() => this.draw());
    }
    
    protected scaleToBoardSize() {
        this.ctx.restore();
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.scale(this.canvas.width / this.board.width, this.canvas.height / this.board.height);
    }
}