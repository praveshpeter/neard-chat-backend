const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const chatSocket = require('./sockets/chatSocket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

chatSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});