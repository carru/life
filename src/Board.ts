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

    public toggleCell(x: number, y: number): void {
        this.data[y][x] = (this.data[y][x]) ? 0 : 1;
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

    public loopData(callback: (cell: number, x: number, y: number) => void): void {
        Board.loop(this.data, callback);
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

    public insertPrefab(x: number, y: number, prefab: number[][]): void {
        Board.loop(prefab, (cell, pfx, pfy) => {
            if (cell)
                this.data[y + pfy][x + pfx] = 1;
        });
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
        let neighbours: number[][] = this.newBlankGrid(this.width, this.height);
        Board.loopAndSet(neighbours, (cell, x, y) => {
            let neighboursCount: number = 0;

            // Use try/catches for when trying to read outside the grid
            try { neighboursCount += this.data[y - 1][x - 1]; } catch (error) { }
            try { neighboursCount += this.data[y - 1][x]; } catch (error) { }
            try { neighboursCount += this.data[y - 1][x + 1]; } catch (error) { }
            try { neighboursCount += this.data[y][x - 1]; } catch (error) { }
            try { neighboursCount += this.data[y][x + 1]; } catch (error) { }
            try { neighboursCount += this.data[y + 1][x - 1]; } catch (error) { }
            try { neighboursCount += this.data[y + 1][x]; } catch (error) { }
            try { neighboursCount += this.data[y + 1][x + 1]; } catch (error) { }

            return neighboursCount;
        });

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