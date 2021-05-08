export class Board {
    public data: number[][] = [];

    constructor(width?: number, height?: number) {
        if (width && height)
            this.data = new Array(height).fill(0).map(() => new Array(width).fill(0));
    }

    public randomize(): void {
        let width: number = this.width;
        let height: number = this.height;

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                this.data[y][x] = Math.round(Math.random());
            }
        }
    }

    public step(): void {
        // TODO calculate new cells; just randomize for now
        this.randomize();
    }

    public copyAndResize(width: number, height: number): Board {
        let oldWidth: number = this.width;
        let oldHeight: number = this.height;
        
        let newData: number[][] = [];
        for(let y = 0; y < height; y++) {
            newData[y] = [];
            for(let x = 0; x < width; x++) {
                if (x < oldWidth && y < oldHeight)
                    newData[y][x] = this.data[y][x];
                else
                    newData[y][x] = 0;
            }
        }

        let newBoard: Board = new Board();
        newBoard.data = newData;
        return newBoard;
    }

    public get width() {
        if (!this.data) return 0;
        return this.data[0].length;
    }

    public get height() {
        if (!this.data) return 0;
        return this.data.length;
    }
}