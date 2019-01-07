const logger = require('pino')();
const EVENT = require('../src/common/event');

class Connection {
  static createConnection(client) {
    return new Connection(client);
  }

  constructor(client) {
    // Tell everyone about our new guest
    client.broadcast.emit(EVENT.NewConnection, client.id);
    logger.info('New connection', { id: client.id });

    client.emit(EVENT.ConnectionList, Object.keys(Connection.connections));
    Connection.connections[client.id] = client;

    // This client has asked to send a broadcast message
    client.on(EVENT.Broadcast, (message) => {
      logger.info('Broadcast received', { id: client.id, message });
      client.broadcast.emit(EVENT.Broadcast, {
        id: client.id,
        message,
      });
    });

    // This client has asked to send a message to a specific id
    client.on(EVENT.Message, (toId, message) => {
      if (Connection.connections[toId]) {
        logger.info('Message', { from: client.id, to: toId, message });
        Connection.connections[toId].emit(EVENT.Message, {
          id: client.id,
          message,
        });
      } else {
        logger.info('Message to non-existent id', { from: client.id, to: toId, message });
      }
    });

    // The client has disconnected
    client.on('disconnect', () => {
      logger.info('Disconnect', { id: client.id });
      delete Connection.connections[client.id];
      client.broadcast.emit(EVENT.Disconnect, client.id);
    });
  }
};

Connection.connections = {};

module.exports.Connection = Connection;
