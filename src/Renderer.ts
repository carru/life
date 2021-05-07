export class Renderer {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('board') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public draw(board: number[][]): void {
        if (!board) return;

        this.scaleToBoardSize(board[0].length, board.length);

        this.ctx.fillStyle = 'black';
        board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell)
                    this.ctx.fillRect(x, y, 1, 1);
            })
        })
    }
    
    protected scaleToBoardSize(boardX: number, boardY: number) {
        this.ctx.restore();
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.scale(this.canvas.width / boardX, this.canvas.height / boardY);
    }
}