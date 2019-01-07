const path = require('path');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

// Here we will store our connected clients
const connections = {};

io.on('connection', (client) => {
  // Tell everyone about our new guest
  client.broadcast.emit('NEW_CONNECTION', client.id);
  console.log('New connection', client.id);
  client.emit('CONNECTIONS', Object.keys(connections));
  connections[client.id] = client;

  // This client has asked to send a broadcast message
  client.on('sendBroadcast', (message) => {
    console.log('Broadcast from', client.id, message);
    client.broadcast.emit('BROADCAST', {
      id: client.id,
      message,
    });
  });

  // This client has asked to send a message to a specific id
  client.on('sendMessage', (toId, message) => {
    console.log('Message from', client.id, 'to', toId, message);
    if (connections[toId]) {
      connections[toId].emit('MESSAGE', {
        id: client.id,
        message,
      });
    }
  });

  // The client has disconnected
  client.on('disconnect', () => {
    console.log(client.id, 'disconnected');
    delete connections[client.id];
    client.broadcast.emit('DISCONNECT', client.id);
  });
});

// This stuff serves the built React app in production
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8000
server.listen(port, () => console.log(`connected to port ${port}!`));
