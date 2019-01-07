/**
 * Answer details about the current game state
 */
export default class Game {
  constructor(board) {
    this.board = board;
  }

  exposedFunctions = ['whoHas']

  whoHas = (spot) => {
    switch (this.board[spot - 1]) {
      case 0:
        return false;
      case 1:
        return 'x';
      case 2:
        return 'o';
      default:
        throw new Error(`Invalid value for position: ${spot}`);
    }
  }

  won() {
    const winning = [
      [1,2,3],[4,5,6],[7,8,9],
      [1,4,7],[2,5,8],[3,6,9],
      [1,5,9],[7,5,3],
    ].find(([a, b, c]) => {
      return this.whoHas(a)
        && this.whoHas(a) === this.whoHas(b)
        && this.whoHas(b) === this.whoHas(c);
    });
    if (winning) {
      return this.whoHas(winning[0]);
    }
    return false;
  }
}