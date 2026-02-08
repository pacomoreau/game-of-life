export class GameEngine {
  cols: number;
  rows: number;
  current: Uint8Array;
  next: Uint8Array;
  generation: number;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.current = new Uint8Array(cols * rows);
    this.next = new Uint8Array(cols * rows);
    this.generation = 0;
  }

  step(): void {
    const { cols, rows, current, next } = this;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let neighbors = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (row + dr + rows) % rows;
            const nc = (col + dc + cols) % cols;
            neighbors += current[nr * cols + nc];
          }
        }
        const idx = row * cols + col;
        next[idx] = (neighbors === 3 || (current[idx] === 1 && neighbors === 2)) ? 1 : 0;
      }
    }
    const tmp = this.current;
    this.current = this.next;
    this.next = tmp;
    this.generation++;
  }

  reset(): void {
    this.current.fill(0);
    this.next.fill(0);
    this.generation = 0;
  }

  randomize(density: number = 0.3): void {
    for (let i = 0; i < this.current.length; i++) {
      this.current[i] = Math.random() < density ? 1 : 0;
    }
    this.generation = 0;
  }

  setCell(row: number, col: number, value: number): void {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.current[row * this.cols + col] = value;
    }
  }

  getCell(row: number, col: number): number {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.current[row * this.cols + col];
    }
    return 0;
  }

  resize(newCols: number, newRows: number): void {
    const newCurrent = new Uint8Array(newCols * newRows);
    const minCols = Math.min(this.cols, newCols);
    const minRows = Math.min(this.rows, newRows);
    for (let r = 0; r < minRows; r++) {
      for (let c = 0; c < minCols; c++) {
        newCurrent[r * newCols + c] = this.current[r * this.cols + c];
      }
    }
    this.cols = newCols;
    this.rows = newRows;
    this.current = newCurrent;
    this.next = new Uint8Array(newCols * newRows);
  }

  getPopulation(): number {
    let count = 0;
    for (let i = 0; i < this.current.length; i++) {
      count += this.current[i];
    }
    return count;
  }

  loadPattern(cells: [number, number][], originRow: number, originCol: number): void {
    for (const [r, c] of cells) {
      const row = (originRow + r) % this.rows;
      const col = (originCol + c) % this.cols;
      this.current[row * this.cols + col] = 1;
    }
  }
}
