import {
  Game,
  TurnOrder,
  INVALID_MOVE
} from '@djmax/boardgame.io/core';

export default Game({
  name: 'Nim',

  setup(ctx, {
    players,
    names,
    piles = [10],
    maxPick = 3
  }) {
    return {
      scores: {
        p1: 0,
        p2: 0,
      },
      names,
      players,
      playerTypes: players || ['human', 'random'],
      pileConfiguration: piles,
      maxPick,
    };
  },

  flow: {
    startingPhase: 'play',
    movesPerTurn: 1,

    phases: {
      play: {
        allowedMoves: ['pick'],
        next: 'score',
        onPhaseBegin(G, ctx) {
          G.piles = G.pileConfiguration.slice(0);
        },
        endPhaseIf(G, ctx) {
          return G.piles.reduce((prev, cur) => prev + cur, 0) === 1;
        },
      },
      score: {
        allowedMoves: ['continue'],
        next: 'play',
        turnOrder: TurnOrder.ANY_ONCE,
        onPhaseBegin(G, ctx) {},
        endPhaseIf(G) {
          return G.ack >= G.playerTypes.filter(p => p.startsWith('human')).length;
        },
      },
    },
  },

  moves: {
    pick(G, ctx, pile, number) {
      if ((G.piles[pile] || 0) - number < 0) {
        return INVALID_MOVE;
      }
      if (number > G.maxPick && G.maxPick) {
        return INVALID_MOVE;
      }
      const newPiles = G.piles.slice(0);
      newPiles[pile] -= number;
      G.piles = newPiles;
    },
    continue (G, ctx) {
      G.ack = (G.ack || 0) + 1;
    },
  },
});
