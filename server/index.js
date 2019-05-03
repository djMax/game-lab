const logger = require('pino')();
require('@babel/register');

const {
  default: sslify,                   // middleware factory
  xForwardedProtoResolver: resolver, // resolver needed
} = require('koa-sslify');
const path = require('path');
const Server = require('@djmax/boardgame.io/server').Server;
const Dominos = require('../src/dominos/boardgame').default;
const ConnectFour = require('../src/connect-four/boardgame').default;
const Nim = require('../src/nim/boardgame').default;
const addHelpers = require('./helperApi').default;
const { Connection } = require('./Connection');
const server = Server({ games: [Dominos, ConnectFour, Nim], singlePort: true });

const port = Number(process.env.PORT || 8000);

logger.info('Starting server', { port });
server.run(port, () => {
  logger.info('Ready');
});

server.app._io.on('connection', (socket) => Connection.createConnection(socket));

// This serves the built React app in production
server.app.use(require('koa-static')(path.join(__dirname, '..', 'build')));

if (process.env.NODE_ENV === 'production') {
  server.app.use(sslify({ resolver }));
}

addHelpers({ app: server.app });

process.on('unhandledRejection', error => {
  console.log(error);
});