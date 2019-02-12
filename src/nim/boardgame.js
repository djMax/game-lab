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
    maxPick,
    master,
  }) {
    return {
      scores: {
        p1: 0,
        p2: 0,
      },
      names,
      master,
      players,
      playerTypes: players || ['human', 'random'],
      pileConfiguration: piles.map(p => Number(p)),
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
          G.ack = 0;
        },
        endPhaseIf(G, ctx) {
          return G.piles.reduce((prev, cur) => prev + cur, 0) <= 1;
        },
      },
      score: {
        allowedMoves: ['continue'],
        next: 'play',
        turnOrder: TurnOrder.ANY_ONCE,
        onPhaseBegin(G, ctx) {
          G.scores[ctx.currentPlayer === '0' ? 'p1' : 'p2'] += 1;
        },
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
        // Be nice to the kids.
        number = G.maxPick;
      }
      const newPiles = G.piles.slice(0);
      newPiles[pile] -= number;
      G.piles = newPiles;
      G.lastPlay = [ctx.currentPlayer, pile, number];
    },
    continue (G, ctx) {
      G.ack = (G.ack || 0) + 1;
    },
  },
});
