const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('message', message); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
