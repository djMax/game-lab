import LogicalPiece from "./LogicalPiece";

export default class LogicalHand {
  constructor(pieces, board) {
    this.pieces = pieces;
    if (pieces[0] && Array.isArray(pieces[0])) {
      // Normalize our representation
      this.pieces = this.pieces.map(p => ({ values: p }));
    }
    this.board = board;
  }

  get playablePieces() {
    const options = this.board.validPieces;
    if (!options || options.length === 0) {
      return this.pieces.slice(0);
    }
    return this.pieces.filter(p => (options.includes(p.values[0]) || options.includes(p.values[1])));
  }

  static score(pieces) {
    return pieces.reduce((prev, cur) => {
      return prev + Number(cur.values[0]) + Number(cur.values[1]);
    }, 0);
  }

  static doubles(pieces) {
    return pieces.filter(p => LogicalPiece.isDouble(p)).length;
  }

  static sorted(pieces) {
    const pipCount = [];
    pieces.forEach(({ values }) => {
      pipCount[values[0]] = (pipCount[values[0]] || 0) + 1;
      if (values[0] !== values[1]) {
          pipCount[values[1]] = (pipCount[values[1]] || 0) + 1;
      }
    });
    // Sort such that pieces with higher frequency are together
    pieces.forEach(({ values }) => {
      if (pipCount[values[0]] < pipCount[values[1]]) {
        // Flip the piece so we can sort by p[0]
        const pswap = values[1];
        values[1] = values[0];
        values[0] = pswap;
      }
    });
    const sorted = pieces.slice(0);
    sorted.sort(({ values: p1 }, { values: p2 }) => {
      let cmp = (pipCount[p2[0]] - pipCount[p1[0]]);
      if (cmp === 0) {
        // most common pipCount is same, put the lower piece first
        cmp = p1[0] - p2[0];
      }
      if (cmp === 0) {
        // Same first number
        cmp = p1[1] - p2[1];
      }
      return cmp;
    });
    return sorted;
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