const { getChatCount } = require('../store/memoryStore');

function broadcastStats(io) {
  io.emit('stats', {
    online: io.engine.clientsCount,
    chats: getChatCount()
  });
}

module.exports = broadcastStats;