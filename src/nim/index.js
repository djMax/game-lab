import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import Editor from '../editor';
import { MultiplayerGame } from '../common/MultiplayerGame';
import OrganizeGame from './OrganizeGame';
import NimGameManager from './boardgame';
import NimBoard from './Board';
import Approval from '../common/Approval';
import AiSpeedSlider from '../common/AiSpeedSlider';
import SignIn from '../common/SignIn';

const styles = {
  root: {
    flexGrow: 1,
  },
  reminder: {
    marginTop: 30,
    textAlign: 'center',
  }
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
 *   random(n) - pick a random number between 1 and n (up to and including n)
 */
const pile = pickOne(available);
const balls = random(piles[pile]);
return [pile, balls];
`;

class Nim extends MultiplayerGame {
  name = 'Nim'

  aiNames = {
    'random': 'CPU (Random)',
  }

  state = this.defaultState(sampleCode)

  onGameChanged(action) {
    const { currentPlayer, phase } = action.state.ctx;
    const { players, piles, maxPick } = action.state.G;
    const { code } = this.state;
    if (!players[currentPlayer].startsWith('human')) {
      if (phase === 'score') {
        this.sendMove(action.state, 'continue', []);
        return;
      }
      let pile = 0;
      let number = 1;
      if (players[currentPlayer] === 'random') {
        const available = piles.map((pile, ix) => (pile > 0 ? ix : null))
        .filter(ix => ix !== null);
        pile = MultiplayerGame.pickOne(available);
        const balls = MultiplayerGame.random(piles[pile]);
        number = Math.min(maxPick || balls, balls);
      } else if (players[currentPlayer] === 'code') {
        [pile, number] = this.runUserCode(code, action.state.G);
      }
      this.sendMove(action.state, 'pick', [pile, number]);
    }
  }

  runUserCode(code, board) {
    const transformed = window.Babel.transform(`retVal[0] = (function yourCode() { ${code} })()`, { presets: ['es2015'] }).code;
    // eslint-disable-next-line no-new-func
    const fn = new Function('board', 'pickOne', 'random', 'piles', 'maxPick', 'available', 'retVal', transformed);

    const allowed = board.piles
      .map((pile, ix) => (pile > 0 ? ix : null))
      .filter(ix => ix !== null);

    try {
      const retVal = [];
      fn(
        board,
        MultiplayerGame.pickOne,
        MultiplayerGame.random,
        board.piles.slice(0),
        board.maxPick || 0,
        allowed,
        retVal,
      );
      console.log('User code returned', retVal[0]);
      if (!Array.isArray(retVal[0])) {
        retVal[0] = [0, retVal[0]];
      }
      const [pile, number] = retVal[0];
      if (!allowed.includes(pile) || number <= 0) {
        console.error('User code return invalid move');
      } else {
        return [pile, number];
      }
    } catch (error) {
      // TODO tell the user there was an error
      console.error('User code failed', error);
    }
    return allowed[0];
  }

  render() {
    const { classes, multiplayer } = this.props;
    const { code, gameID, playerID, credentials, speed, gameMaster } = this.state;

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
              (
                <div>
                  <NimClient playerID={playerID} gameID={gameID} credentials={credentials} onLeave={this.onLeave} />
                  <AiSpeedSlider isMaster={gameMaster} speed={speed} setSpeed={v => this.setState({ speed: v })} />
                  <Typography variant="h6" className={classes.reminder}>
                    Remember, the one that takes the last ball loses.
                  </Typography>
                </div>
              )
              :
              <OrganizeGame ai={this.aiNames} onReady={this.startGame} defaultPlayers={['human', 'code']} />
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
    {multiplayer => multiplayer.state.name ? <Nim {...props} multiplayer={multiplayer} /> : <SignIn />}
  </Subscribe>
))