import openSocket from 'socket.io-client';
import EVENT from './common/event';

function callOptional(subscriber, method, ...args) {
  if (typeof subscriber[method] === 'function') {
    subscriber[method](...args);
  }
}

export default class Api {
  constructor() {
    this.socket = openSocket();
    this.socket.on('reconnect', () => {
      const name = window.localStorage.getItem('player.name');
      if (name) {
        this.socket.emit(EVENT.Broadcast, { name });
      }
    });
    this.socket.on('connect', () => {
      const name = window.localStorage.getItem('player.name');
      if (name) {
        this.socket.emit(EVENT.Broadcast, { name });
      }
    });
  }

  subscribe(subscriber) {
    return [
      this.socket.on(EVENT.NewConnection, id => callOptional(subscriber, 'onNewConnection', id)),
      this.socket.on(EVENT.Broadcast, ({ id, message }) => callOptional(subscriber, 'onBroadcast', id, message)),
      this.socket.on(EVENT.Message, ({ id, message }) => callOptional(subscriber, 'onMessage', id, message)),
      this.socket.on(EVENT.Disconnect, id => callOptional(subscriber, 'onDisconnect', id)),
      this.socket.on(EVENT.ConnectionList, ids => callOptional(subscriber, 'onConnectionList', ids)),
    ];
  }

  sendBroadcast(message) {
    this.socket.emit(EVENT.Broadcast, message);
  }

  sendMessage(id, message) {
    this.socket.emit(EVENT.Message, id, message);
  }

  disconnect() {
    this.socket.disconnect();
    delete this.socket;
  }
}
