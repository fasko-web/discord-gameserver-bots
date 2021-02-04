const humanInterval = require('human-interval');
const Bottleneck = require('bottleneck');
const Crypto = require('crypto');
const jf = require('jsonfile');
const queryServer = require('./server.js');
const queryPtero = require('./pterodactyl.js');

const limiter = new Bottleneck({
  maxConcurrent: 1,
  highWater: 1,
  reservoir: 1,
  reservoirRefreshInterval: humanInterval(process.env.SERVER_QUERY_INTERVAL),
  reservoirRefreshAmount: 1
});

const pteroLimiter = new Bottleneck({
  maxConcurrent: 1,
  highWater: 1,
  reservoir: 1,
  reservoirRefreshInterval: humanInterval(process.env.PTERODACTYL_QUERY_INTERVAL),
  reservoirRefreshAmount: 1
});

module.exports = async function query(client_id, server) {
  const cache = jf.readFileSync(`./cache/${server.abbr}.json`, { throws: false });
  limiter.on('failed', async(error, jobInfo) => {
    console.warn('[ERROR]', `Server query failed. (${server.name})\n${error}`);
    if (jobInfo.retryCount !== 0) return;
    console.log('[WARN]', `Retrying server query in one second. (${server.name})`);
    return 1000;
  });
  pteroLimiter.on('failed', async(error, jobInfo) => {
    console.warn('[ERROR]', `Pterodactyl query failed. (${server.name})\n${error}`);
    if (jobInfo.retryCount !== 0) return;
    console.log('[WARN]', `Retrying pterodactyl query in one second. (${server.name})`);
    return 1000;
  });
  limiter.on('retry', (error, jobInfo) => console.log('[INFO]', `Retrying pterodactyl query. (${server.name})`));
  let response = {
    state: cache.current_state,
    connect: cache.connect,
    players: cache.players,
    maxPlayers: cache.max_players,
    map: cache.map
  };
  if (server.api && server.api.enabled) {
    if (!server.api.url) {
      console.log('[ERROR]', `URL is required for Web API! (${server.name})`);
      process.exit();
    } else {
      //response = await setInterval(queryWeb, 1000 * 30, server.api); // Queries REST API every 30 seconds
    }
  } else {
    try {
      response = await limiter.schedule({
        id: `${server.abbr}-server-query-${Crypto.randomBytes(6).toString('hex').slice(0, 6)}`
      }, () => queryServer(server.ip, server.port, server.game));
      console.log('[EVENT]', `Server queried. (${server.name})`);
    } catch(err) {}
  }

  console.log(response);
  let state = response.state;
  if (server.pterodactyl && server.pterodactyl.enabled) {
    try {
      const pteroState = await pteroLimiter.schedule({
        id: `${server.abbr}-ptero-query-${Crypto.randomBytes(6).toString('hex').slice(0, 6)}`
      }, () => queryPtero(server.pterodactyl));
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
      if (json.players === obj.players) return;
      jf.writeFile(`./cache/${server.abbr}.json`, json, function(err) {
        if (err) return console.log(err);
        console.log('[EVENT]', `Cache updated. (${server.name})`);
      })
    })
    resolve({ activity: activity, status: results.status });
  });
};
