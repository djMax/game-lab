import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import Editor from '../editor';
import { MultiplayerGame } from '../common/MultiplayerGame';
import OrganizeGame from './OrganizeGame';
import ConnectFourGameManager from './boardgame';
import ConnectFourBoard from './Board';

const styles = {
  root: {
    flexGrow: 1,
  },
};

const sampleCode = `/*
 * This code decides how the computer moves. You need to return
 * which column to move into (0 is the first column)
 */
return 0;`;

class ConnectFour extends MultiplayerGame {
  name = 'ConnectFour'

  aiNames = {
    'random': 'CPU (Random)',
  }

  state = {
    code: window.localStorage.getItem('connect4.code') || sampleCode,
  }

  headlineForState(gameState) {
    return 'Start';
  }

  render() {
    const { classes, multiplayer } = this.props;
    const { code, gameID, playerID, credentials } = this.state;

    const Connect4Client = gameID ? this.getClient(gameID, ConnectFourGameManager, ConnectFourBoard) : () => null;

    if (!gameID && multiplayer.state.newGame && multiplayer.state.newGame.name === this.name) {
//      return <Approval multiplayer={multiplayer} onComplete={this.onApproval} />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            {gameID
              ?
              <Connect4Client playerID={playerID} gameID={gameID} credentials={credentials} />
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
    {multiplayer => <ConnectFour {...props} multiplayer={multiplayer} />}
  </Subscribe>
))