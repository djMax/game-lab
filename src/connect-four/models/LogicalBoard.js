function sameOrFalse(arr) {
  if (arr[0] === -1) {
    return false;
  }
  const isSame = arr.reduce((prev, cur) => (prev === cur ? prev : false), arr[0]);
  return isSame;
}

function assemble(columns, start, inc) {
  const arr = [];
  for (let i = 0; i < 4; i += 1) {
    const col = start.col + (i * inc.col);
    const row = start.row + (i * inc.row);
    arr.push(columns[col][row]);
  }
  return arr;
}

export default class LogicalBoard {
  constructor({ columns }) {
    this.columns = columns;
  }

  didGameEnd() {
    return this.winner() !== null || this.availableMoves().length === 0;
  }

  winner() {
    const rows = this.columns[0].length;
    // Check vertical
    for (let col = 0; col < this.columns.length; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const start = { col, row };
        let winner = false;
        if (row >= 3) {
          winner = sameOrFalse(assemble(this.columns, start, { col: 0, row: -1 }));
        }
        if (col >= 3 && winner === false) {
          winner = sameOrFalse(assemble(this.columns, start, { col: -1, row: 0 }));
        }
        if (winner === false && col >= 3 && row <= rows - 4) {
          winner = sameOrFalse(assemble(this.columns, start, { col: -1, row: 1 }));
        }
        if (winner === false && col >= 3 && row >= 3) {
          winner = sameOrFalse(assemble(this.columns, start, { col: -1, row: -1 }));
        }
        if (winner !== false) {
          return winner;
        }
      }
    }
    return null;
  }

  availableMoves() {
    return this.columns.map((col, ix) => {
      if (col.indexOf(-1) === -1) {
        return false;
      }
      return ix;
    }).filter(x => x !== false);
  }
}
