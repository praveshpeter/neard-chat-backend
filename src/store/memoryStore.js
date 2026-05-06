const waiting = new Map();
const partners = new Map();

let chatCount = 0;

module.exports = {
  waiting,
  partners,
  getChatCount: () => chatCount,
  incrementChats: () => chatCount++
};