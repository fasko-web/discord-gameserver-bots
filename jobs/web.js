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
      const state = body[api.server_id];
      return {
        state: 'on',
        connect: state.connect || state.address || `${state.ip}:${state.port}`,
        players: (state.players >= 0) ? state.players.toString() : state.players.length.toString(),
        maxPlayers: state.maxPlayers.toString() || state.max_players.toString(),
        map: state.map || false
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
