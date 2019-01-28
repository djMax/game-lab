import React from 'react';
import { applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { withStyles, Drawer, Fab } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Client } from '@djmax/boardgame.io/react';
import { Subscribe } from 'unstated';
import Editor from '../editor';
import MultiplayerContainer from '../common/MultiplayerContainer';
import DominoGameManager from './boardgame';
import Board from './components/Board';
import apiCall from '../common/apiCall';
import sendMove from './ai';
import OrganizeGame from './components/OrganizeGame';
import DominoContainer from './DominoContainer';

const styles = {
  root: {
    flexGrow: 1,
  },
  code: {
    width: '65vw',
    minWidth: 500,
    padding: 50,
  },
  expander: {
    position: 'absolute',
    right: 28,
    top: '50%',
    marginTop: -28,
  },
  expanded: {
    position: 'absolute',
    left: -28,
    top: '50%',
    marginTop: -28,
    '& svg': {
      marginLeft: 20,
    }
  },
};

const sampleCode = `/*
* Your function takes a board and a hand and must return a piece
* to place on the board, and optionally which side to put it on
* if it can fit both ways. If you have no pieces to play, the game
* will not call your function and 'pass' for you.
*/
return hand.playablePieces[0];
`;

class Dominos extends React.Component {
  state = {
    codeOpen: false,
    code: window.localStorage.getItem('dominos.code') || sampleCode,
  }

  clients = {}

  onCodeChange = (code) => {
    this.setState({ code });
    window.localStorage.setItem('playground.code', code);
  }

  onCodeCommit = (multiplayer) => {
    const { code } = this.state;
    multiplayer.newCode('dominos', code);
  }

  metadataToName = (spec) => {
    if (spec === 'random') {
      return 'CPU (Random)';
    }
    if (spec === 'highest') {
      return 'CPU (Highest Piece)';
    }
    const { multiplayer } = this.props;
    if (spec.startsWith('human')) {
      const id = spec.substring('human:'.length);
      if (id === multiplayer.id) {
        return multiplayer.state.name;
      }
      const other = multiplayer.state.others[id];
      return (other ? other.name : null) || id;
    }
    if (spec.startsWith('code')) {
      let id = spec.substring('code:'.length);
      if (!id) {
        return `${multiplayer.state.name}'s Code`;
      }
      id = id.substring(0, id.indexOf(':'));
      if (id === multiplayer.id) {
        return `${multiplayer.state.name}'s Code`;
      }
      const other = multiplayer.state.others[id];
      return `${(other ? other.name : null) || id}'s Code`;
    }
  }

  startGame = async (players) => {
    const names = players.map(this.metadataToName);
    const { gameID } = await apiCall('/games/Dominos/create', {
      setupData: {
        master: this.props.multiplayer.id,
        players,
        names,
      },
      numPlayers: 4,
    });
    this.props.multiplayer.broadcast({
      type: 'NewGame',
      players,
      names,
      gameID,
    });
    const joinUrl = `/games/Dominos/${gameID}/join`;
    const playerID = String(players.indexOf(`human:${this.props.multiplayer.id}`));
    const join = await apiCall(joinUrl, {
      playerID,
      playerName: this.props.multiplayer.state.name,
    });
    const aiCredentials = {};
    const aiPlayers = players
      .map((player, index) => ({ player, index }))
      .filter(p => !p.player.startsWith('human'));
    await Promise.all(aiPlayers.map(async ({ player, index}) => {
      // TODO pick a better player name
      const { playerCredentials } = await apiCall(joinUrl, { playerID: index, playerName: 'AI' });
      aiCredentials[index] = playerCredentials;
    }));
    const newState = { playerID, gameID, gameMaster: true, players, credentials: join.playerCredentials, aiCredentials };
    window.localStorage.setItem('dominos.currentGame', JSON.stringify(newState));
    this.setState(newState);
  }

  toggle = () => this.setState({ codeOpen: !this.state.codeOpen })

  getClient(gameID) {
    if (this.clients[gameID]) {
      return this.clients[gameID];
    }
    const { gameMaster, code } = this.state;
    const { multiplayer, dominoState } = this.props;

    const clientArgs = {
      game: DominoGameManager,
      board: Board,
      multiplayer: { server: '' },
      debug: false,
      numPlayers: 4,
      enhancer: applyMiddleware(
        logger,
        ({ getState }) => next => action => {
          if (gameMaster && (action.type === 'SYNC' || action.type === 'UPDATE')) {
            const { currentPlayer } = action.state.ctx;
            const { players, aiCredentials } = this.state;
            if (!players[currentPlayer].startsWith('human')) {
              apiCall(`/games/Dominos/${gameID}/getHand`, {
                playerID: currentPlayer,
                credentials: aiCredentials[currentPlayer],
              }).then(({ hand }) => {
                sendMove({
                  speed: dominoState.state.speed,
                  gameID,
                  multiplayer,
                  hand,
                  action,
                  players,
                  credentials: aiCredentials[currentPlayer],
                  code,
                });
              });
            }
          }
          return next(action);
        }),
    };
    this.clients[gameID] = Client(clientArgs);
    return this.clients[gameID];
  }

  render() {
    const { codeOpen, code, gameID, playerID, credentials } = this.state;
    const { classes, multiplayer } = this.props;
    const DominoClient = gameID ? this.getClient(gameID) : () => null;

    return (
      <div className={classes.root}>

        {gameID ? <DominoClient playerID={playerID} gameID={gameID} credentials={credentials} /> : <OrganizeGame onReady={this.startGame} />}

        <Drawer anchor="right" open={codeOpen} onClose={this.closeCode}>
          <div className={classes.code}>
            <Editor
              code={code}
              onChange={this.onCodeChange}
              onCommit={() => this.onCodeCommit(multiplayer)}
            />
          </div>
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.expanded}
            onClick={this.toggle}
          >
            <ArrowForwardIcon />
          </Fab>
        </Drawer>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.expander}
          onClick={this.toggle}
        >
          <ArrowBackIcon />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(props => (
  <Subscribe to={[MultiplayerContainer, DominoContainer]}>
    {(multiplayer, dominoState) => <Dominos {...props} multiplayer={multiplayer} dominoState={dominoState} />}
  </Subscribe>
));
