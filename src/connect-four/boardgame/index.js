import { Game, TurnOrder, INVALID_MOVE } from '@djmax/boardgame.io/core';
import LogicalBoard from '../models/LogicalBoard';

export function emptyBoard(cols, rows) {
  return Array(cols).fill(0).map(x => Array(rows).fill(-1));
}

export default Game({
  name: 'ConnectFour',

  setup(ctx, { players, names }) {
    return {
      scores: {
        p1: 0,
        p2: 0,
        draw: 0,
      },
      names,
      players,
      playerTypes: players || ['human', 'random'],
    };
  },

  flow: {
    startingPhase: 'play',
    movesPerTurn: 1,

    phases: {
      play: {
        allowedMoves: ['place'],
        next: 'score',
        onPhaseBegin(G, ctx) {
          G.columns = emptyBoard(7, 6);
          G.ack = 0;
        },
        endPhaseIf(G, ctx) {
          return new LogicalBoard(G).didGameEnd();
        },
      },
      score: {
        allowedMoves: ['continue'],
        next: 'play',
        turnOrder: TurnOrder.ANY_ONCE,
        onPhaseBegin(G, ctx) {
          const winner = new LogicalBoard(G).winner();
          G.lastWinner = winner;
          if (winner === 0) {
            G.scores.p1 += 1;
          } else if (winner === 1) {
            G.scores.p2 += 1;
          } else {
            G.scores.draw += 1;
          }
        },
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
      const available = G.columns[column].lastIndexOf(-1);
      if (available === -1) {
        return INVALID_MOVE;
      }
      G.columns[column][available] = Number(ctx.currentPlayer);
      G.lastMove = [column, available];
    },
    continue(G, ctx) {
      G.ack = (G.ack || 0) + 1;
    }
  },
});
