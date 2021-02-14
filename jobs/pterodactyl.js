const { pRateLimit } = require('p-ratelimit');
const bent = require('bent');

const oldLimit = pRateLimit({ interval: 60000, rate: 60 });
const newLimit = pRateLimit({ interval: 60000, rate: 240 });

const source = {
  old: { endpoint: 'utilization', data: 'state' },
  new: { endpoint: 'resources', data: 'current_state' }
}

module.exports = async (pterodactyl) => {
  if (!pterodactyl || !pterodactyl.enabled) return;
  const api = bent(pterodactyl.url, {
    Referer: 'discord-gameserver-bots',
    Authorization: `Bearer ${pterodactyl.api_key}`,
    Accept: 'Application/vnd.pterodactyl.v1+json'
  });
  const endpoint = `/api/client/servers/${pterodactyl.server_id}/${source[pterodactyl.version].endpoint || source.old.endpoint}`

  if (pterodactyl.version === 'new') {
    res = await newLimit(() => api(endpoint));
  } else {
    res = await oldLimit(() => api(endpoint));
  }
  if (res.statusCode === 200) {
    const body = await res.json();
    return body.attributes[source[pterodactyl.version].data] || body.attributes[source.old.data];
  } else {
    console.log('[ERROR]', res);
    return 'unknown';
  }
};
