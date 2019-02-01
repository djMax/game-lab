import { Game, TurnOrder, INVALID_MOVE } from '@djmax/boardgame.io/core';
import LogicalBoard from '../models/LogicalBoard';

function emptyBoard(cols, rows) {
  return Array(cols).fill(0).map(x => [Array(rows).fill(-1)]);
}

export default Game({
  name: 'ConnectFour',

  setup(ctx, { players, names }) {
    return {
      scores: {
        p1: 0,
        p2: 0,
      },
      names,
      players,
      playerTypes: players || ['human', 'random'],
      columns: emptyBoard(7, 6),
    };
  },

  flow: {
    movesPerTurn: 1,
    phases: {
      default: {
        allowedMoves: ['place'],
        next: 'score',
        endPhaseIf(G, ctx) {
          return new LogicalBoard(G).didGameEnd();
        },
      },
      score: {
        allowedMoves: ['continue'],
        next: 'play',
        turnOrder: TurnOrder.ANY_ONCE,
        endPhaseIf(G) {
          return G.ack >= G.playerTypes.filter(p => p.startsWith('human')).length;
        },
      }
    },
  },

  moves: {
    place(G, ctx, column) {
      if (G.columns[column].length >= G.rows - 1) {
        return INVALID_MOVE;
      }
      G.columns[column].push(ctx.currentPlayer);
    },
    continue(G, ctx) {
      G.ack = (G.ack || 0) + 1;
    }
  },
});
