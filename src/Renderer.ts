import { Board } from "./Board";
import { UI } from "./UI";

interface Colors {
    active: string,
    highlighted: string,
    prefab: string
}

export class Renderer {
    public board: Board | undefined;
    public colors!: Colors;
    public activePrefab: number[][] | undefined;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected requestID: number | undefined;
    protected highlightedCellX: number | undefined;
    protected highlightedCellY: number | undefined;
    protected scaleFactorX: number | undefined;
    protected scaleFactorY: number | undefined;
    protected prevTimestamp: number;

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
        UI.setStatsText(0, 0);
    }

    protected onMouseMove(x: number, y: number): void {
        if (this.scaleFactorX && this.scaleFactorY) {
            this.highlightedCellX = Math.floor(x / this.scaleFactorX);
            this.highlightedCellY = Math.floor(y / this.scaleFactorY);
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

    protected draw(timestamp: number): void {
        const frametime = timestamp - this.prevTimestamp;
        const fps = 1 / (frametime / 1000);
        UI.setStatsText(frametime, fps);
        this.prevTimestamp = timestamp;

        if (!this.board) return;

        this.scaleToBoardSize();

        // Draw active cells
        this.ctx.fillStyle = this.colors.active;
        this.board.loopData((cell, x, y) => {
            if (cell)
                this.ctx.fillRect(x, y, 1, 1);
        })

        // Is mouse over canvas?
        if (this.highlightedCellX !== undefined && this.highlightedCellY !== undefined) {
            // Placing prefab?
            if (this.activePrefab) {
                this.ctx.fillStyle = this.colors.prefab;
                Board.loop(this.activePrefab, (cell, x, y) => {
                    if (cell)
                        this.ctx.fillRect(this.highlightedCellX! + x, this.highlightedCellY! + y, 1, 1);
                });
            }
            // Highlight cell under mouse
            else {
                this.ctx.fillStyle = this.colors.highlighted;
                this.ctx.fillRect(this.highlightedCellX, this.highlightedCellY, 1, 1);
            }
        }

        this.requestID = window.requestAnimationFrame((timestamp) => this.draw(timestamp));
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