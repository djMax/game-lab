/**
 * Answer details about the current game state
 */
export default class Game {
  constructor(board, playerValue) {
    this.board = board;
    this.playerValue = playerValue;
  }

  winners = [
    [1,2,3],[4,5,6],[7,8,9],
    [1,4,7],[2,5,8],[3,6,9],
    [1,5,9],[7,5,3],
  ]

  exposedProperties = ['whoHas', 'mine', 'theirs', 'winners', 'firstEmpty', 'iAmX', 'moveCount'];

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

  iAmX = () => {
    return this.moveCount() % 2 === 0;
  }

  moveCount = () => {
    return this.board.reduce((prev, cur) => (prev + (cur ? 1 : 0)), 0);
  }

  mine = (...spots) => {
    return spots.every(s => this.whoHas(s) === this.playerValue);
  }

  theirs = (...spots) => {
    return spots.every(s => (this.whoHas(s) && this.whoHas(s) !== this.playerValue));
  }

  firstEmpty = (...spots) => {
    return spots.find(s => !this.whoHas(s));
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

  done() {
    if (this.board.reduce((prev, cur) => prev + (cur ? 1 : 0), 0) === 9) {
      return true;
    }
  }
}