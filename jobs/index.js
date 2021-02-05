const humanInterval = require('human-interval');
const Bottleneck = require('bottleneck');
const jf = require('jsonfile');
const queryWeb = require('./web.js');
const queryServer = require('./server.js');
const queryPtero = require('./pterodactyl.js');

const bottleneckSettings = { maxConcurrent: 1, highWater: 1, reservoir: 1, reservoirRefreshAmount: 1 }

const webLimiter = new Bottleneck({
  ...bottleneckSettings,
  reservoirRefreshInterval: humanInterval(process.env.WEB_QUERY_INTERVAL || '30 seconds')
});

const serverLimiter = new Bottleneck({
  ...bottleneckSettings,
  reservoirRefreshInterval: humanInterval(process.env.SERVER_QUERY_INTERVAL || '1 minute')
});

const pteroLimiter = new Bottleneck({
  ...bottleneckSettings,
  reservoirRefreshInterval: humanInterval(process.env.PTERODACTYL_QUERY_INTERVAL || '15 seconds')
});

const limiters = [
  { name: 'Web API', type: webLimiter },
  { name: 'Server', type: serverLimiter },
  { name: 'Pterodactyl', type: pteroLimiter }
];

module.exports = async function query(client_id, server) {
  let cache = jf.readFileSync(`./cache/${server.abbr}.json`, { throws: false })
  if (cache) {
    cache = { state: cache.current_state, connect: cache.connect, players: cache.players, maxPlayers: cache.max_players, map: cache.map };
  }
  limiters.map(limiter => {
    limiter.type.on('failed', async(err, job) => {
      console.warn('[ERROR]', `${limiter.name} query failed. (${server.name})\n${err}`);
      if (job.retryCount !== 0) return;
      console.log('[WARN]', `Retrying ${limiter.name.toLowerCase()} query in one second. (${server.name})`);
      return humanInterval('1 sec');
    });
    limiter.type.on('retry', (err, job) => console.log('[INFO]', `Retrying ${limiter.name.toLowerCase()} query. (${server.name})`));
  });
  let response = cache || {
    state: 'off',
    connect: ((server.port) ? `${server.ip}:${server.port}`: server.ip),
    players: '0',
    maxPlayers: 'N/A',
    map: 'N/A'
  };
  if (server.api && server.api.enabled) {
    if (!server.api.url) {
      console.log('[ERROR]', `URL is required for Web API! (${server.name})`);
      process.exit();
    } else {
      try {
        response = await webLimiter.schedule(() => queryWeb(server.ip, server.port, server.api));
        console.log('[EVENT]', `Web API queried. (${server.name})`);
      } catch(err) {}
    }
  } else {
    try {
      response = await serverLimiter.schedule(() => queryServer(server.ip, server.port, server.game));
      console.log('[EVENT]', `Server queried. (${server.name})`);
    } catch(err) {}
  }

  console.log(response);
  let state = response.state;
  if (server.pterodactyl && server.pterodactyl.enabled) {
    try {
      const pteroState = await pteroLimiter.schedule(() => queryPtero(server.pterodactyl));
      console.log('[EVENT]', `Pterodactyl queried. (${server.name})`);
      console.log(pteroState);
      state = ((state !== pteroState) ? pteroState : state);
    } catch(err) {}
  }

  const data = {
    on: {
      current_state: {
        on: {
          status: 'online',
          activity: {
            players: `${response.players}/${response.maxPlayers}`,
            map: response.map,
            both: `${response.players}/${response.maxPlayers} on ${response.map}`,
            default: 'Server Online'
          }
        },
        off: {
          status: 'idle',
          activity: 'Fetching Info..'
        }
      }
    },
    off: {
      status: 'dnd',
      activity: 'Server Offline'
    },
    starting: {
      current_state: {
        on: {
          status: 'online',
          activity: {
            players: `${response.players}/${response.maxPlayers}`,
            map: response.map,
            both: `${response.players}/${response.maxPlayers} on ${response.map}`,
            default: 'Server Online'
          }
        },
        off: {
          status: 'idle',
          activity: 'Server Starting..'
        }
      }
    },
    stopping: {
      status: 'idle',
      activity: 'Server Stopping..'
    }
  }

  let options = 'default';
  if (server.bot.status.players) {
    options = ((server.bot.status.map) ? 'both' : 'players');
  } else if (server.bot.status.map) {
    options = 'map';
  }

  const results = ((state !== 'off' || state !== 'stopping') ? data[state].current_state[response.state] : data[state]);
  const activity = ((results.activity[options]) ? results.activity[options] : results.activity);

  const json = {
    bot_id: client_id,
    current_state: state || 'off',
    connect: response.connect || ((server.port) ? `${server.ip}:${server.port}` : server.ip),
    players: response.players || 'N/A',
    max_players: response.maxPlayers || 'N/A',
    map: response.map || 'N/A'
  }

  return new Promise((resolve, reject) => {
    jf.readFile(`./cache/${server.abbr}.json`, function(err, obj) {
      if (obj && obj.players === json.players) return;
      jf.writeFile(`./cache/${server.abbr}.json`, json, function(err) {
        if (err) return console.log(err);
        console.log('[EVENT]', `Cache updated. (${server.name})`);
      })
    })
    resolve({ activity: activity, status: results.status });
  });
};
