import LogicalPiece from "./LogicalPiece";

/**
 * LogicalBoard encapsulates the state of a domino game board
 * so you can ask questions about it, and create new boards as
 * the result of playing a new piece
 */
export default class LogicalBoard {
  /**
   * A board has a root piece, a list of pieces off the left of the root piece
   * and a list of pieces off the right of the root piece.
   * The convention is that the second values element is the "outward facing"
   * set of pips, the exception being the root piece where 0 is left and 1 is
   * right, arbitrarily
   */
  constructor({ root = null, left = [], right = [] }) {
    this.root = root;
    this.left = left;
    this.right = right;
    this.playCount = (root ? 1 : 0) + left.length + right.length;
  }

  /**
   * Get the pip count of the "exposed" part of the left end of the chain
   */
  get leftOption() {
    const { left, root } = this;
    return left.length ? left[left.length - 1].values[1]: root.values[0];
  }

  /**
   * Get the pip count of the "exposed" part of the right end of the chain
   */
  get rightOption() {
    const { right, root } = this;
    return right.length ? right[right.length - 1].values[1]: root.values[1];
  }

  /**
   * Figure out if the game ended, and if so how it ended
   */
  didGameEnd() {
    const { root, left, right } = this;
    if (this.playCount < 7) {
      return LogicalBoard.GameEnd.None;
    }
    const pieceCount = [0, 0, 0, 0, 0, 0, 0];
    const playerPieceCount = [7, 7, 7, 7];
    const readPiece = (p) => {
      playerPieceCount[p.by] -= 1;
      pieceCount[p.values[0]] -= 1;
      if (!LogicalPiece.isDouble(p)) {
        pieceCount[p.values[1]] -= 1;
      }
    };
    readPiece(root);
    left.forEach(readPiece);
    right.forEach(readPiece);
    if (playerPieceCount.includes(0)) {
      return LogicalBoard.GameEnd.PlayerEmpty;
    }
    if (pieceCount[this.leftOption] === 0 || pieceCount[this.rightOption] === 0) {
      return LogicalBoard.GameEnd.Closed;
    }
    return LogicalBoard.GameEnd.None;
  }

  place(player, piece, placeLeft = null) {
    const newPiece = {
      values: [...piece.values],
      by: player,
      sequence: this.playCount + 1,
    };
    if (!this.root) {
      this.root = newPiece;
      this.playCount += 1;
      return this;
    }

    let leftExposed = this.leftOption;
    let rightExposed = this.rightOption;
    const { left, right } = this;
    const existing = left.length + right.length;

    if (placeLeft === true || placeLeft !== false) {
      // See if the piece fits on the left
      if (leftExposed === newPiece.values[0]) {
        this.left.push(newPiece);
      } else if (leftExposed === newPiece.values[1]) {
        newPiece.values.reverse();
        this.left.push(newPiece);
      }
    }
    if ((existing === left.length + right.length)
      && (placeLeft !== true || placeLeft === false)) {
      // See if the piece fits on the right
      if (rightExposed === newPiece.values[0]) {
        this.right.push(newPiece);
      } else if (rightExposed === newPiece.values[1]) {
        newPiece.values.reverse();
        this.right.push(newPiece);
      }
    }

    if (existing === left.length + right.length) {
      const error = new Error('Invalid move');
      error.invalidMove = true;
      throw error;
    }
    this.playCount += 1;
    return this;
  }

  get validPieces() {
    const { left, right, root } = this;
    if (!root) { return [0, 1, 2, 3, 4, 5, 6]; }
    const possible = [
      left.length ? left[left.length - 1].values[1] : root.values[0],
      right.length ? right[right.length - 1].values[1] : root.values[1],
    ];
    if (possible[0] === possible[1]) {
      return [possible[0]];
    }
    return possible;
  }

  get playedPieces() {
    const { left, right, root } = this;
    if (!root) {
      return [];
    }
    return [root, ...left, ...right];
  }

  toState() {
    return {
      root: this.root,
      left: this.left,
      right: this.right,
      playCount: this.playCount,
    };
  }

  /**
   * Get a new board by placing a piece on this board
   */
  static getNewBoard(board, player, piece, placeLeft) {
    return new LogicalBoard(board).place(player, piece, placeLeft).toState();
  }

  static GameEnd = {
    // The game is not done
    None: 0,
    // A player has no more pieces
    PlayerEmpty: 1,
    // The game has been closed, no more pieces can be played
    Closed: 2,
  }
}

LogicalBoard.allDominos = [];
for (let firstHalf = 0; firstHalf <= 6; firstHalf += 1) {
  for (let secondHalf = firstHalf; secondHalf <= 6; secondHalf += 1) {
    LogicalBoard.allDominos.push({
      values: [firstHalf, secondHalf],
    });
  }
}
