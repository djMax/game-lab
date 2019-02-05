import tap from 'tap';
import LogicalBoard from './LogicalBoard';
import { emptyBoard } from '../boardgame';

const blankRow = [-1, -1, -1, -1, -1, -1];

tap.test('Board Win Checks', (t) => {
  const columns = emptyBoard(7, 6);

  const lb = new LogicalBoard({ columns }, true);
  t.strictEquals(lb.didGameEnd(), false, 'Game should not have ended');
  columns[0] = [-1, -1, 0, 0, 0, 0];
  t.strictEquals(lb.didGameEnd(), true, 'Game should have ended with vertical win');

  columns[0] = blankRow.slice(0);
  columns[0][5] = columns[1][5] = columns[2][5] = columns[3][5] = 0;
  t.strictEquals(lb.didGameEnd(), true, 'Game should have ended with horizontal win');

  columns[0][5] = columns[1][4] = columns[2][3] = columns[3][2] = 1;
  t.strictEquals(lb.didGameEnd(), true, 'Game should have ended with diagonal win');

  columns[0][5] = columns[1][4] = columns[2][3] = columns[3][2] = -1;
  columns[0][2] = columns[1][3] = columns[2][4] = columns[3][5] = 0;
  t.strictEquals(lb.didGameEnd(), true, 'Game should have ended with diagonal win');

  t.end();
});

tap.test('Board Will Win Checks', (t) => {
  let columns = emptyBoard(7, 6);

  const board = new LogicalBoard({ columns }, true)
    .boardWithMove(0, true)
    .boardWithMove(0, true)
    .boardWithMove(0, true);

  t.ok(board.willIWin(0), 'Should win with 4th move');

  board.isRed = false;
  t.ok(!board.willIWin(0), 'Should not win with color flipped');
  t.ok(board.willTheyWin(0), 'They Should win with color flipped');

  t.end();
});
