const { pRateLimit } = require('p-ratelimit');
const bent = require('bent');

const rateLimit = pRateLimit({ interval: 60000, rate: 240 });

module.exports = async (ip, port = false, api) => {
  if (!api || !api.enabled) return;
  const stream = bent({
    Referer: 'discord-gameserver-bots'
  });
  let res = await rateLimit(() => stream(api.url));
  if (res.statusCode === 200) {
    const body = await res.json();
    if (body[api.server_id] && body[api.server_id].map.toString() !== 'N/A') {
      const server = body[api.server_id];
      return {
        state: 'on',
        connect: server.connect || `${server.ip}:${server.port}`,
        players: server.players.toString(),
        maxPlayers: server.maxPlayers.toString() || server.max_players.toString(),
        map: server.map
      }
    } else {
      console.log('[ERROR]', body);
      return {
        state: 'off',
        connect: ((port) ? `${ip}:${port}` : ip),
        players: '0',
        maxPlayers: 'N/A',
        map: 'N/A'
      }
    }
  }
}
