import LogicalPiece from "./LogicalPiece";

export default class LogicalHand {
  static score(pieces) {
    return pieces.reduce((prev, cur) => {
      return prev + Number(cur.values[0]) + Number(cur.values[1]);
    }, 0);
  }

  static doubles(pieces) {
    return pieces.filter(p => LogicalPiece.isDouble(p)).length;
  }

  static deal(shuffler) {
    let hands;
    do {
      const pieces = shuffler();
      hands = [
        pieces.slice(0, 7),
        pieces.slice(7, 14),
        pieces.slice(14, 21),
        pieces.slice(21),
      ];
      // Make sure nobody has 4 doubles
    } while (hands.find(hand => LogicalHand.doubles(hand) >= 4));
    return hands;
  }
}