const haversine = require('../utils/haversine');
const { waiting, partners } = require('../store/memoryStore');

const MATCH_RADIUS_KM = 10;

function tryMatch(newUser) {
  for (const [wid, wUser] of waiting.entries()) {
    if (wid === newUser.id) continue;

    const dist = haversine(
      newUser.lat,
      newUser.lng,
      wUser.lat,
      wUser.lng
    );

    if (dist <= MATCH_RADIUS_KM) {
      waiting.delete(wid);
      waiting.delete(newUser.id);

      partners.set(newUser.id, wid);
      partners.set(wid, newUser.id);

      const d = dist.toFixed(1);

      newUser.socket.emit('matched', {
        partnerId: wid,
        partnerName: wUser.name,
        distance: d
      });

      wUser.socket.emit('matched', {
        partnerId: newUser.id,
        partnerName: newUser.name,
        distance: d
      });

      console.log(`Matched ${newUser.name} with ${wUser.name}`);

      return true;
    }
  }

  return false;
}

module.exports = tryMatch;