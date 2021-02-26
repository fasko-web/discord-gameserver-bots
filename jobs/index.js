const humanInterval = require('human-interval');
const jf = require('jsonfile');
const queryWeb = require('./web.js');
const queryServer = require('./server.js');
const queryPtero = require('./pterodactyl.js');
const cacheUtils = require('../utils/cache.js');

module.exports = async function query(client_id, server) {
  let cache = jf.readFileSync(`./cache/${server.abbr}.json`, { throws: false });

  let response = {
    state: (cache) ? cache.current_state : 'off',
    connect: (cache) ? cache.connect : ((server.port) ? `${server.ip}:${server.port}`: server.ip),
    players: (cache) ? cache.players : '0',
    maxPlayers: (cache) ? cache.max_players : 'N/A',
    map: (cache) ? cache.map : 'N/A',
    lastQueryTimes: (cache) ? cache.last_query_times : false
  };

  const intervals = {
    web: process.env.WEB_QUERY_INTERVAL || '30 seconds',
    server: process.env.SERVER_QUERY_INTERVAL || '1 minute',
    ptero: process.env.PTERODACTYL_QUERY_INTERVAL || '15 seconds'
  };

  let state = response.state;
  let currentState = response.state;
  let lqt = response.lastQueryTimes;
  let webQueryTime = (lqt && lqt.web !== false) ? new Date(lqt.web) : false;
  let serverQueryTime = (lqt && lqt.server !== false) ? new Date(lqt.server) : false;
  let pteroQueryTime = (lqt && lqt.ptero !== false) ? new Date(lqt.ptero) : false;

  try {
    switch(true) {
      case (server.api && server.api.enabled): // Queries Web API
        if (!server.api.url) {
          console.log('[ERROR]', `URL is required for Web API! (${server.name})`);
          process.exit();
        } else if (!webQueryTime || webQueryTime < new Date((new Date) - humanInterval(intervals.web))) {
          response = await queryWeb(server.ip, server.port, server.api);
          webQueryTime = new Date;
          console.log('[EVENT]', `(${server.name}) Web API queried.`);
        }
      break;
      default: // Queries Game Server
        if (!serverQueryTime || serverQueryTime < new Date((new Date) - humanInterval(intervals.server))) {
          response = await queryServer(server.ip, server.port, server.game);
          serverQueryTime = new Date;
          console.log('[EVENT]', `(${server.name}) Server queried.`);
        }
    }
    state = response.state;

    // Queries Pterodactyl
    if (server.pterodactyl && server.pterodactyl.enabled) {
      if (!pteroQueryTime || pteroQueryTime < new Date((new Date) - humanInterval(intervals.ptero))) {
        currentState = await queryPtero(server.pterodactyl);
        pteroQueryTime = new Date;
        // state = ((state !== pteroState) ? pteroState : state);
        console.log('[EVENT]', `(${server.name}) Pterodactyl queried.`);
      }
    } else {
      currentState = response.state;
    }
  } catch (err) { console.log(err) };

  //console.log(state, response);

  let onlineActivity = 'Server Online';
  if (server.bot.status.players && server.bot.status.map) {
    onlineActivity = `${response.players}/${response.maxPlayers} on ${response.map}`;
  } else if (server.bot.status.players) {
    onlineActivity = `${response.players}/${response.maxPlayers}`
  } else if (server.bot.status.map) {
    onlineActivity = response.map
  }

  const presence = {
    on: {
      status: 'online',
      activity: (state !== 'on' || response.maxPlayers === 'N/A') ? 'Fetching Info..' : onlineActivity
    },
    off: {
      status: (state !== 'on') ? 'dnd' : 'online',
      activity: (state !== 'on') ? 'Server Offline' : onlineActivity
    },
    starting: {
      status: (state !== 'on') ? 'idle' : 'online',
      activity: (state !== 'on') ? 'Server Starting..' : onlineActivity
    },
    stopping: {
      status: (state !== 'on') ? 'idle' : 'online',
      activity: (state !== 'on') ? 'Server Stopping..' : onlineActivity
    },
    unknown: {
      status: 'dnd',
      activity: 'Panel Error'
    }
  }
  const status = presence[currentState].status;
  const activity = presence[currentState].activity;

  const json = {
    bot_id: client_id,
    current_state: currentState || 'off',
    connect: response.connect || ((server.port) ? `${server.ip}:${server.port}` : server.ip),
    players: response.players || 'N/A',
    max_players: response.maxPlayers || 'N/A',
    map: response.map || 'N/A',
    last_query_times: {
      web: webQueryTime,
      server: serverQueryTime,
      ptero: pteroQueryTime
    }
  }
  //console.log(json);
  return new Promise((resolve, reject) => {
    jf.readFile(`./cache/${server.abbr}.json`, function(err, obj) {
      if (obj && obj.last_query_times) {
        cacheUtils.ensureAllCaches(server, obj, json);
        if (!server.pterodactyl.enabled) {
          cacheUtils.ensureWebCache(server, obj, json);
          cacheUtils.ensureServerCache(server, obj, json);
        }
      } else {
        cacheUtils.writeCache(server, json);
      }
    })
    resolve({ activity: activity, status: status });
  });
};
