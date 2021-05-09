export class Board {
    public data: number[][] = [];

    constructor(width?: number, height?: number) {
        if (width && height)
            this.data = this.newBlankGrid(width, height);
    }

    public randomize(): void {
        this.loopAndSetData(() => { return Math.round(Math.random()) });
    }

    public clear(): void {
        this.loopAndSetData(() => { return 0 });
    }

    protected loopAndSetData(callback: (cell: number, x: number, y: number) => number): void {
        Board.loopAndSet(this.data, callback);
    }

    protected static loopAndSet(data: number[][], callback: (cell: number, x: number, y: number) => number): void {
        let width: number = data[0].length;
        let height: number = data.length;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                data[y][x] = callback(data[y][x], x, y);
            }
        }
    }

    public static loop(data: number[][], callback: (cell: number, x: number, y: number) => void): void {
        let width: number = data[0].length;
        let height: number = data.length;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                callback(data[y][x], x, y);
            }
        }
    }

    protected newBlankGrid(width: number, height: number): number[][] {
        return new Array(height).fill(0).map(() => new Array(width).fill(0));
    }

    public step(): void {
        let neighbours: number[][] = this.calculateNeighbours();
        this.loopAndSetData((cell, x, y) => {
            /* Rules from wikipedia
             * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules */

            // Any live cell with two or three live neighbours survives
            if (cell && (neighbours[y][x] === 2 || neighbours[y][x] === 3))
                return 1;
            // Any dead cell with three live neighbours becomes a live cell
            else if (!cell && neighbours[y][x] === 3)
                return 1;
            // All other live cells die in the next generation. Similarly, all other dead cells stay dead
            else
                return 0;
        });
    }

    protected calculateNeighbours(): number[][] {
        // TODO this spaghetti is embarrasing; refactor to use loopAndSet

        let width: number = this.width;
        let height: number = this.height;
        // 0 based width/height
        let w: number = width - 1;
        let h: number = height - 1;

        let neighbours: number[][] = this.newBlankGrid(width, height);
        // Corners
        neighbours[0][0] =
            this.data[0][1] +
            this.data[1][0] +
            this.data[1][1];
        neighbours[h][0] =
            this.data[h][1] +
            this.data[h - 1][0] +
            this.data[h - 1][1];
        neighbours[0][w] =
            this.data[0][w - 1] +
            this.data[1][w] +
            this.data[1][w - 1];
        neighbours[h][w] =
            this.data[h][w - 1] +
            this.data[h - 1][w] +
            this.data[h - 1][w - 1];
        // Sides
        for (let y = 1; y < h; y++) {
            neighbours[y][0] =
                this.data[y - 1][0] +
                this.data[y - 1][1] +
                this.data[y][1] +
                this.data[y + 1][1] +
                this.data[y + 1][0];
            neighbours[y][w] =
                this.data[y - 1][w] +
                this.data[y - 1][w - 1] +
                this.data[y][w - 1] +
                this.data[y + 1][w - 1] +
                this.data[y + 1][w];
        }
        for (let x = 1; x < w; x++) {
            neighbours[0][x] =
                this.data[0][x - 1] +
                this.data[1][x - 1] +
                this.data[1][x] +
                this.data[1][x + 1] +
                this.data[0][x + 1];
            neighbours[h][x] =
                this.data[h][x - 1] +
                this.data[h - 1][x - 1] +
                this.data[h - 1][x] +
                this.data[h - 1][x + 1] +
                this.data[h][x + 1];
        }
        // Inside
        for (let y = 1; y < h; y++) {
            for (let x = 1; x < w; x++) {
                neighbours[y][x] =
                    this.data[y - 1][x - 1] +
                    this.data[y - 1][x] +
                    this.data[y - 1][x + 1] +
                    this.data[y][x - 1] +
                    this.data[y][x + 1] +
                    this.data[y + 1][x - 1] +
                    this.data[y + 1][x] +
                    this.data[y + 1][x + 1];
            }
        }

        return neighbours;
    }

    protected normalize(): void {
        this.loopAndSetData((cell) => { return (cell) ? 1 : 0 });
    }

    public copyAndResize(width: number, height: number): Board {
        let oldWidth: number = this.width;
        let oldHeight: number = this.height;

        let newData: number[][] = this.newBlankGrid(width, height);
        Board.loopAndSet(newData, (cell, x, y) => {
            if (x < oldWidth && y < oldHeight)
                return this.data[y][x];
            else
                return 0;
        });

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