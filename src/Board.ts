export class Board {
    protected _data: number[][] = [];

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