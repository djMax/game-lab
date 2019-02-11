import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import Editor from '../editor';
import { MultiplayerGame } from '../common/MultiplayerGame';
import OrganizeGame from './OrganizeGame';
import NimGameManager from './boardgame';
import NimBoard from './Board';
import Approval from '../common/Approval';

const styles = {
  root: {
    flexGrow: 1,
  },
};

const sampleCode = `/*
 * This code decides how the computer moves. You need to return
 * which pile to choose from and how many to take, as an array,
 * like this:
 *   return [0, 3]; // That picks three balls from the first pile
 *
 *  piles - an array with the current status of all the piles
 *  maxPick - the maximum number of balls you can take at once, or 0 if there is no maximum
 *  piles.length - the number of piles
 *  available - an array with pile numbers that have available balls
 *
 * And some useful helpers:
 *   pickOne(someArray) - pick a random value from an array
 */
return [pickOne(available), 1];
`;

class Nim extends MultiplayerGame {
  name = 'Nim'

  aiNames = {
    'random': 'CPU (Random)',
  }

  state = this.defaultState(sampleCode)

  onGameChanged(action) {
    const { currentPlayer, phase } = action.state.ctx;
    const { players } = action.state.G;
    const { code } = this.state;
    if (phase === 'score') {
      return;
    }
    if (!players[currentPlayer].startsWith('human')) {
      let pile = 0;
      let number = 1;
      if (players[currentPlayer] === 'random') {
      } else if (players[currentPlayer] === 'defensive') {
      } else if (players[currentPlayer] === 'code') {
        [pile, number] = this.runUserCode(code);
      }
      this.sendMove(action.state, 'pick', [pile, number]);
    }
  }

  runUserCode(code, board) {
    const transformed = window.Babel.transform(`retVal[0] = (function yourCode() { ${code} })()`, { presets: ['es2015'] }).code;
    // eslint-disable-next-line no-new-func
    const fn = new Function('board', 'pickOne', 'random', 'piles', 'maxPick', 'available', 'retVal', transformed);

    try {
      const retVal = [];
      fn(
        board,
        MultiplayerGame.pickOne,
        MultiplayerGame.random,
        board.piles.slice(0),
        board.piles
          .map((pile, ix) => (pile > 0 ? ix : null))
          .filter(ix => ix !== null),
        board.maxPick || 0,
        retVal,
      );
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

    const NimClient = gameID ? this.getClient(gameID, NimGameManager, NimBoard) : () => null;

    if (!gameID && multiplayer.state.newGame && multiplayer.state.newGame.name === this.name) {
      return <Approval multiplayer={multiplayer} onComplete={this.onApproval} />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            {gameID
              ?
              <NimClient playerID={playerID} gameID={gameID} credentials={credentials} onLeave={this.onLeave} />
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
    {multiplayer => <Nim {...props} multiplayer={multiplayer} />}
  </Subscribe>
))