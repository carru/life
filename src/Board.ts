export class Board {
    protected _data: number[][] = [];

    constructor(width: number, height: number) {
        this._data = new Array(height).fill(0).map(() => new Array(width).fill(0));
    }

    public randomize(): void {
        this._data.forEach((row, y) => {
            row.forEach((cell, x) => {
                this._data[x][y] = Math.round(Math.random());
            })
        })
    }

    public step(): void {
        // TODO calculate new cells; just randomize for now
        this.randomize();
    }

    public get data() {
        return this._data;        
    }

    public set data(data: number[][]) {
        if (!data) throw new Error('Invalid board data');
        this._data = data;
    }

    public get width() {
        if (!this._data) return 0;
        return this._data[0].length;
    }

    public get height() {
        if (!this._data) return 0;
        return this._data.length;
    }
}