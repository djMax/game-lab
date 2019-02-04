import openSocket from 'socket.io-client';
import LogicalBoard from './models/LogicalBoard';
import LogicalHand from './models/LogicalHand';

function chooseRandom(pieces) {
  const ix = parseInt(Math.random() * pieces.length);
  return pieces[ix];
}

function chooseHighest(pieces) {
  let maxPiece;
  let maxPips = -1;
  pieces.forEach((p) => {
    const pv = p[0] + p[1];
    if (pv === maxPips) {
      if (Math.max(maxPiece[0], maxPiece[1]) < Math.max(p[0], p[1])) {
        maxPiece = p;
      }
    } else if (pv > maxPips) {
      maxPiece = p;
      maxPips = pv;
    }
  });
  return maxPiece;
}

function runUserCode(code, board, pieces) {
  const hand = new LogicalHand(pieces, board);
  const transformed = window.Babel.transform(`retVal[0] = (function yourCode() { ${code} })()`, { presets: ['es2015'] }).code;
  // eslint-disable-next-line no-new-func
  const fn = new Function('board', 'hand', 'retVal', transformed);

  try {
    const retVal = [];
    fn(board, hand, retVal);
    if (!retVal[0] || !retVal[0].values) {
      console.error('User code returned', retVal[0]);
    } else {
      return retVal[0].values;
    }
  } catch (error) {
    // TODO tell the user there was an error
    console.error('User code failed', error);
  }
  return chooseRandom(pieces);
}

export default function sendMove({ action, speed, players, credentials, hand, gameID, code }) {
  const { currentPlayer, phase } = action.state.ctx;
  const { board, scores } = action.state.G;

  const message = {
    type: 'MAKE_MOVE',
    payload: {
      type: 'playDomino',
      args: [],
      playerID: currentPlayer,
      credentials,
    }
  };

  const isFirstGame = scores.nw === 0 && scores.ew === 0;
  if (phase === 'score') {
    message.payload.type = 'continue';
  } else if (isFirstGame && !board.root) {
    // Double 6 required
    message.payload.args = { values: [6, 6] };
  } else {
    const logicalBoard = new LogicalBoard(board);
    const possibles = logicalBoard.validPieces;
    const pieces = hand.filter(p => possibles.includes(p[0]) || possibles.includes(p[1]));
    if (pieces.length > 0) {
      let piece;
      if (players[currentPlayer] === 'random') {
        piece = chooseRandom(pieces);
      } else if (players[currentPlayer] === 'highest') {
        piece = chooseHighest(pieces);
      } else if (players[currentPlayer] === 'code') {
        piece = runUserCode(code, board, pieces);
      } else if (players[currentPlayer].startsWith('code:')) {
        const whoAndCode = players[currentPlayer].substring(5);
        const otherCode = whoAndCode.substring(whoAndCode.indexOf(':') + 1);
        piece = runUserCode(otherCode, board, pieces);
      } else {
        piece = pieces[0];
      }
      message.payload.args.push({ values: piece });
      console.log(Number(currentPlayer) + 1, 'will play', message.payload.args[0]);
    } else {
      message.payload.type = 'pass';
      console.log(Number(currentPlayer + 1), 'will pass');
    }
  }
  const socket = openSocket('/Dominos');
  socket.once('connect', () => {
    setTimeout(() => {
      socket.emit('update', message, action.state._stateID || 0, `Dominos:${gameID}`, currentPlayer);
      socket.disconnect();
    }, speed);
  });
}
