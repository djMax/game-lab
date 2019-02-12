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
        p1Start: { p1: 0, p2: 0 },
        p2Start: { p1: 0, p2: 0 },
      },
      scoreSlot: 'p1Start',
      names,
      master,
      players,
      playerTypes: players || ['human', 'code'],
      pileConfiguration: piles.map(p => Number(p)),
      maxPick,
      turns: [],
    };
  },

  flow: {
    startingPhase: 'play',
    movesPerTurn: 1,

    phases: {
      play: {
        allowedMoves: ['pick'],
        next: 'score',
        turnOrder: {
          first(G, ctx) {
            return G.scoreSlot === 'p1Start' ? '0' : '1';
          },
          next(G, ctx) {
            // Some sort of bug causes next to get called
            // before a turn starts.
            if (G.turns.length === 0) {
              return G.scoreSlot === 'p1Start' ? '0' : '1';
            }
            return ctx.currentPlayer === '1' ? '0' : '1';
          },
        },
        onPhaseBegin(G, ctx) {
          G.piles = G.pileConfiguration.slice(0);
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
          G.scores[G.scoreSlot][ctx.currentPlayer === '0' ? 'p1' : 'p2'] += 1;
          G.scoreSlot = G.scoreSlot === 'p1Start' ? 'p2Start' : 'p1Start';
        },
        onPhaseEnd(G, ctx) {
          G.ack = 0;
          G.turns = [];
        },
        endPhaseIf(G) {
          return G.ack >= Math.max(G.playerTypes.filter(p => p.startsWith('human')).length, 1);
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
      const turnSummary = [ctx.currentPlayer, pile, number];
      G.turns.push(turnSummary);
    },
    continue (G, ctx) {
      G.ack = (G.ack || 0) + 1;
    },
  },
});
