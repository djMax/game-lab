import { Game, TurnOrder, INVALID_MOVE } from '@djmax/boardgame.io/core';
import LogicalBoard from '../models/LogicalBoard';
import LogicalPiece from '../models/LogicalPiece';
import LogicalHand from '../models/LogicalHand';

export default Game({
  name: 'Dominos',
  playerView(G, ctx, playerID) {
    // Strip secrets and player pieces UNLESS the game is over, in which case
    // let all players see the remaining pieces
    let r = { ...G };

    if (r.secret !== undefined) {
      delete r.secret;
    }

    if (r.players && ctx.phase !== 'score') {
      r.players = {
        [playerID]: r.players[playerID],
      };
    }

    return r;
  },

  setup(ctx, { players, names, master } = {}) {
    return {
      secret: {},
      scores: {
        ns: 0,
        ew: 0,
      },
      names,
      master,
      playerTypes: players || ['human', 'highest', 'highest', 'highest'],
      players: {},
      lastPlay: [],
      pieces: [0, 0, 0, 0],
    };
  },

  flow: {
    startingPhase: 'play',
    movesPerTurn: 1,

    phases: {
      play: {
        allowedMoves: ['playDomino', 'pass'],
        turnOrder: {
          first(G, ctx) {
            if (ctx.phase === 'score') {
              return 0;
            }

            if (G.lastWinner !== undefined) {
              console.log('Last winner starts', G.lastWinner);
              return String(G.lastWinner);
            }

            // TODO if some team won, let them start
            // Find the double six...
            const owner = Object.entries(G.players)
              .find(([playerId, pieces]) => {
                return pieces.hand.find(p => p.values[0] === 6 && p.values[1] === 6);
              });
            if (owner) {
              console.log('Double six starts, which is player', Number(owner[0]) + 1);
              return Number(owner[0]);
            }
            return 0;
          },
          next(G, ctx) {
            return (ctx.playOrderPos + 1) % ctx.playOrder.length;
          },
        },
        onPhaseBegin(G, ctx) {
          console.log('Allocating dominos');
          G.players = LogicalHand
            .deal(() => ctx.random.Shuffle(LogicalBoard.allDominos))
            .reduce((map, hand, ix) => {
              map[ix] = { hand };
              return map;
            }, {});
          G.pieces = [7, 7, 7, 7];
          G.board = { root: null, left: [], right: [] };
        },
        endPhaseIf(G, ctx) {
          return new LogicalBoard(G.board).didGameEnd() !== LogicalBoard.GameEnd.None;
        },
        next: 'score',
      },

      score: {
        allowedMoves: ['continue'],
        next: 'play',
        turnOrder: TurnOrder.ANY_ONCE,
        onPhaseBegin(G, ctx) {
          const { players } = G;
          const pointTotals = [
            LogicalHand.score(players[0].hand),
            LogicalHand.score(players[1].hand),
            LogicalHand.score(players[2].hand),
            LogicalHand.score(players[3].hand),
          ];
          let winner = Object.entries(players).find(([pid, { hand }]) => hand.length === 0);
          if (!winner) {
            let minScore = Number.MAX_SAFE_INTEGER;
            for (let i = 0; i < 4; i += 1) {
              const thisPlayer = (Number(ctx.currentPlayer) + i) % ctx.playOrder.length;
              if (pointTotals[thisPlayer] < minScore) {
                winner = thisPlayer;
                minScore = pointTotals[thisPlayer];
              }
            }
          } else {
            winner = winner[0];
          }
          if (["0","2"].includes(String(winner))) {
            G.completed = {
              winner,
              points: pointTotals[1] + pointTotals[3],
              hands: [...players[1].hand, ...players[3].hand],
            };
            G.scores.ns += G.completed.points;
          } else {
            G.completed = {
              winner,
              points: pointTotals[0] + pointTotals[2],
              hands: [...players[0].hand, ...players[2].hand],
            };
            G.scores.ew += G.completed.points;
          }
          G.lastWinner = winner;
        },
        endPhaseIf(G) {
          return G.board.ack === G.playerTypes.filter(p => p.startsWith('human')).length;
        },
      },
    },
  },

  moves: {
    playDomino(G, ctx, piece, placeLeft) {
      const { scores, board } = G;
      if (scores.ns === 0 && scores.ew === 0 && !board.root
        && (piece.values[0] !== 6 || piece.values[1] !== 6)) {
        return INVALID_MOVE;
      }
      const player = Number(ctx.currentPlayer);
      console.log(`Player ${player + 1} is playing ${piece.values}`);
      try {
        G.board = LogicalBoard.getNewBoard(G.board, player, piece, placeLeft);
      } catch (error) {
        if (error.invalidMove) {
          return INVALID_MOVE;
        }
        throw error;
      }
      G.pieces[player] = G.pieces[player] - 1;
      G.players[player].hand = G.players[player].hand.filter(p => !LogicalPiece.isSamePiece(p, piece));
      G.lastPlay[player] = piece;
    },

    pass(G, ctx) {
      // TODO make sure they really pass
      const player = Number(ctx.currentPlayer);
      G.lastPlay[player] = 'pass';
    },

    deferStart(G, ctx) {

    },

    continue(G, ctx) {
      G.board.ack = (G.board.ack || 0) + 1;
    }
  },
});