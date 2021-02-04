const { pRateLimit } = require('p-ratelimit');
const bent = require('bent');

const rateLimit = pRateLimit({ interval: 60000, rate: 240 });
// limits your web API with 240 requests a minute or 4 requests a second.

module.exports = async (ip, port = false, api) => {
  if (!api || !api.enabled) return;
  const getJSON = bent('json');
  let json = await rateLimit(() => getJSON(api.url, {
    Referer: 'discord-gameserver-bots'
  }));
  console.log(json[api.server_id]);
  if (json[api.server_id] && json[api.server_id].players) {
    const server = json[api.server_id];
    console.log(json);
    return {
      state: 'on',
      connect: server.connect || `${server.ip}:${server.port}`,
      players: server.players,
      maxPlayers: server.maxPlayers || server.max_players,
      map: server.map
    }
  } else {
    console.log('[ERROR]', json);
    return {
      state: 'off',
      connect: ((port) ? `${ip}:${port}` : ip),
      players: '0',
      maxPlayers: 'N/A',
      map: 'N/A'
    }
  }
}
