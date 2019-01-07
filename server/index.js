const logger = require('pino')();
const path = require('path');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const { Connection } = require('./Connection');

io.on('connection', (client) => {
  Connection.createConnection(client);
});

// This stuff serves the built React app in production
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8000
server.listen(port, () => logger.info('Server listening', { port }));
