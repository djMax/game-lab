export default class LogicalBoard {
  constructor({ columns }) {
    this.columns = columns;
  }

  didGameEnd() {
    return false;
  }
}
