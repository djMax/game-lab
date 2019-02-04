import React from 'react';
import logger from 'redux-logger';
import { Client } from '@djmax/boardgame.io/react';
import { applyMiddleware } from 'redux';
import openSocket from 'socket.io-client';
import apiCall from './apiCall';

export class MultiplayerGame extends React.Component {
  // The internal (not seen by humans) name of your game
  name = 'MultiplayerGame'

  // A map of the AI key and name for built in players
  aiNames = {}

  numPlayers = 2

  // A client side cache of Boardgame instances, which is necessary
  // for game masters to run moves on behalf of AIs
  clients = {}

  // Just in case you forget to define it...
  state = this.defaultState()

  defaultState() {
    return {
      code: window.localStorage.getItem(`${this.name}.code`),
    };
  }

  onCodeChange = (code) => {
    this.setState({ code });
    window.localStorage.setItem(`${this.name}.code`, code);
  }

  onCodeCommit = () => {
    const { multiplayer } = this.props;
    const { code } = this.state;
    multiplayer.newCode(this.name, code);
  }

  onLeave = () => {
    this.setState({ gameID: null, credentials: null, playerID: null, players: null });
  }

  metadataToName = (spec) => {
    if (this.aiNames[spec]) {
      return this.aiNames[spec];
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

  onApproval = async (approved) => {
    const { multiplayer } = this.props;
    const { players, gameID } = multiplayer.state.newGame;
    if (approved) {
      const playerID = String(players.indexOf(`human:${multiplayer.id}`));
      const join = await apiCall(`/games/${this.name}/${gameID}/join`, {
        playerID,
        playerName: multiplayer.state.name,
      });
      this.setState({ gameID, players, playerID, credentials: join.playerCredentials }, () => {
        multiplayer.clearBroadcast();
      });
    } else {
      multiplayer.clearBroadcast();
    }
  }

  startGame = async (players) => {
    const names = players.map(this.metadataToName);
    const { gameID } = await apiCall(`/games/${this.name}/create`, {
      setupData: {
        master: this.props.multiplayer.id,
        players,
        names,
      },
      numPlayers: this.numPlayers,
    });
    this.props.multiplayer.broadcast({
      type: 'NewGame',
      name: this.name,
      players,
      names,
      gameID,
    });
    const joinUrl = `/games/${this.name}/${gameID}/join`;
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
    window.localStorage.setItem(`${this.name}.currentGame`, JSON.stringify(newState));
    this.setState(newState);
  }

  onGameChanged(action) { }

  getClient(gameID, game, board) {
    if (this.clients[gameID]) {
      return this.clients[gameID];
    }

    const { gameMaster } = this.state;
    const clientArgs = {
      game,
      board,
      multiplayer: { server: '' },
      debug: false,
      numPlayers: this.numPlayers,
      enhancer: applyMiddleware(
        logger,
        ({ getState }) => next => action => {
          if (gameMaster && (action.type === 'SYNC' || action.type === 'UPDATE')) {
            this.onGameChanged(action);
          }
          return next(action);
        }),
    };
    this.clients[gameID] = Client(clientArgs);
    return this.clients[gameID];
  }

  sendMove(gameState, moveName, args) {
    const { ctx: { currentPlayer }, _stateID } = gameState;
    const { aiCredentials, gameID, speed = 1000 } = this.state;
    const message = {
      type: 'MAKE_MOVE',
      payload: {
        type: moveName,
        args: args,
        playerID: currentPlayer,
        credentials: aiCredentials[currentPlayer],
      }
    };
    const socket = openSocket(`/${this.name}`);
    console.error('SENDING', message, _stateID);
    socket.once('connect', () => {
      setTimeout(() => {
        socket.emit('update', message, _stateID || 0, `${this.name}:${gameID}`, currentPlayer);
        socket.disconnect();
      }, speed);
    });
  }
}