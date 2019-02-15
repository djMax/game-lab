import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import Editor from '../common/editor';
import { MultiplayerGame } from '../common/MultiplayerGame';
import OrganizeGame from './OrganizeGame';
import ConnectFourGameManager from './boardgame';
import ConnectFourBoard from './Board';
import LogicalBoard from './models/LogicalBoard';
import Approval from '../common/Approval';
import SignIn from '../common/SignIn';

const styles = {
  root: {
    flexGrow: 1,
  },
};

const sampleCode = `/*
 * This code decides how the computer moves. You need to return
 * which column to move into (0 is the first column)
 *
 * You are passed a "board" object that you can ask questions of:
 *   board.willIWin(0) - returns true if you will win by moving to column 3
 *   board.willTheyWin(3) - returns true if they will win by moving to column 3
 *   board.availableMoves() - returns an array of available moves
 *
 * And some useful helpers:
 *   pickOne(someArray) - pick a random value from an array
 */
return pickOne(board.availableMoves());
`;

class ConnectFour extends MultiplayerGame {
  name = 'ConnectFour'

  aiNames = {
    'random': 'CPU (Random)',
  }

  state = this.defaultState(sampleCode)

  onGameChanged(action) {
    const { currentPlayer } = action.state.ctx;
    const { players } = action.state.G;
    const { code } = this.state;
    if (!players[currentPlayer].startsWith('human')) {
      const b = new LogicalBoard(action.state.G, String(currentPlayer) === '0');
      const moves = b.availableMoves();
      let spot = 0;
      if (players[currentPlayer] === 'random') {
        spot = moves[parseInt(Math.random() * moves.length, 10)];
      } else if (players[currentPlayer] === 'defensive') {

      } else if (players[currentPlayer] === 'code') {
        spot = this.runUserCode(code, b);
      }
      this.sendMove(action.state, 'place', [moves[spot]]);
    }
  }

  runUserCode(code, board) {
    const transformed = window.Babel.transform(`retVal[0] = (function yourCode() { ${code} })()`, { presets: ['es2015'] }).code;
    // eslint-disable-next-line no-new-func
    const fn = new Function('board', 'pickOne', 'retVal', transformed);

    try {
      const retVal = [];
      fn(board, MultiplayerGame.pickOne, retVal);
      console.log('User code returned', retVal[0]);
      if (!board.availableMoves().includes(retVal[0])) {
        console.error('User code return invalid move');
      } else {
        return retVal[0];
      }
    } catch (error) {
      // TODO tell the user there was an error
      console.error('User code failed', error);
    }
    return board.availableMoves()[0];
  }

  render() {
    const { classes, multiplayer } = this.props;
    const { code, gameID, playerID, credentials } = this.state;

    const Connect4Client = gameID ? this.getClient(gameID, ConnectFourGameManager, ConnectFourBoard) : () => null;

    if (!gameID && multiplayer.state.newGame && multiplayer.state.newGame.name === this.name) {
      return <Approval multiplayer={multiplayer} onComplete={this.onApproval} />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            {gameID
              ?
              <Connect4Client playerID={playerID} gameID={gameID} credentials={credentials} onLeave={this.onLeave} />
              :
              <OrganizeGame ai={this.aiNames} onReady={this.startGame} defaultPlayers={['human', 'random']} />
            }
          </Grid>
          <Grid item xs>
            <Editor
              code={code}
              onChange={this.onCodeChange}
              onCommit={() => this.onCodeCommit(multiplayer)}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(props => (
  <Subscribe to={[MultiplayerContainer]}>
    {multiplayer => multiplayer.state.name ? <ConnectFour {...props} multiplayer={multiplayer} /> : <SignIn />}
  </Subscribe>
))