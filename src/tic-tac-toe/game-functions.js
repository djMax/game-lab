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
    let realArray = spots.flat(3);
    return realArray.every(s => this.whoHas(s) === this.playerValue);
  }

  theirs = (...spots) => {
    let realArray = spots.flat(3);
    return realArray.every(s => (this.whoHas(s) && this.whoHas(s) !== this.playerValue));
  }

  firstEmpty = (...spots) => {
    let realArray = spots.flat(3);
    return realArray.find(s => !this.whoHas(s));
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

  firstAvailable() {
    // Fallback
    for (let i = 1; i <= 9; i++) {
      if (!this.whoHas(i)) {
        return i;
      }
    }
  }

  random() {
    for (let i = 0; i < 10000; i++) {
      const spot = parseInt(Math.random() * 9 + 1, 10);
      if (!this.whoHas(spot)) {
        return spot;
      }
    }
    return this.firstAvailable();
  }

  centerCorner() {
    const spot = [5, 1, 3, 7, 9].find(s => !this.whoHas(s));
    if (spot) {
      return spot;
    }
    return this.firstAvailable();
  }

  manualStrategy() {
    // First block, if needed
    let blockable = this.winners
      .find(([a, b, c]) => (
        (this.theirs(a,b) || this.theirs(b,c) || this.theirs(a,c)) &&
        this.firstEmpty(a,b,c)));

    if (blockable) {
      return this.firstEmpty(blockable);
    }

    // Ok, now is there a place that has two empties and one of our pieces?
    // If so, let's force them to block
    let threaten = this.winners
      .find(([a, b, c]) => {
        let countMine = this.mine(a) ? 1 : 0 +
          this.mine(b) ? 1 : 0 +
          this.mine(c) ? 1 : 0;
        if (countMine !== 1) {
          return false;
        }
        let countTheirs = this.theirs(a) ? 1 : 0 +
          this.theirs(b) ? 1 : 0 +
          this.theirs(c) ? 1 : 0;
        if (countTheirs > 0) {
          return false;
        }
        return true;
      });

    if (threaten) {
      return this.firstEmpty(threaten);
    }

    return this.firstEmpty(5, 1, 3, 7, 9, 2, 4, 6, 8);
  }
}