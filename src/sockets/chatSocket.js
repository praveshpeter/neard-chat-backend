const {
  waiting,
  partners,
  incrementChats
} = require('../store/memoryStore');

const tryMatch = require('../services/matchService');
const broadcastStats = require('../services/statsService');

function chatSocket(io) {
  io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    broadcastStats(io);

    socket.on('search', ({ name, lat, lng }) => {
      waiting.delete(socket.id);

      const user = {
        id: socket.id,
        name,
        lat,
        lng,
        socket
      };

      waiting.set(socket.id, user);

      const matched = tryMatch(user);

      if (!matched) {
        socket.emit('searching');
      }

      broadcastStats(io);
    });

    socket.on('accept-match', ({ partnerId }) => {
      const partnerSocket = io.sockets.sockets.get(partnerId);

      if (partnerSocket) {
        socket.emit('chat-started');
        partnerSocket.emit('chat-started');

        incrementChats();
        broadcastStats(io);
      }
    });

    socket.on('message', ({ text, time }) => {
      const pid = partners.get(socket.id);

      if (!pid) return;

      const partnerSocket = io.sockets.sockets.get(pid);

      if (partnerSocket) {
        partnerSocket.emit('message', { text, time });
      }
    });

    socket.on('disconnect', () => {
      waiting.delete(socket.id);

      const pid = partners.get(socket.id);

      if (pid) {
        const ps = io.sockets.sockets.get(pid);

        if (ps) {
          ps.emit('partner-left');
        }

        partners.delete(socket.id);
        partners.delete(pid);
      }

      broadcastStats(io);
    });
  });
}

module.exports = chatSocket;