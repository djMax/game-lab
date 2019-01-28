export default class LogicalPiece {
  static isDouble(piece) {
    return piece.values[0] === piece.values[1];
  }

  static isSamePiece(p1, p2) {
    if (p1.values[0] === p2.values[0] && p1.values[1] === p2.values[1]) {
      return true;
    }
    if (p1.values[1] === p2.values[0] && p1.values[0] === p2.values[1]) {
      return true;
    }
    return false;
  }
}
