const jf = require('jsonfile');

function writeCache(server, json) {
  jf.writeFile(`./cache/${server.abbr}.json`, json, (err) => {
    if (err) return console.error(err);
    console.log('[EVENT]', `(${server.name}) Cache updated.`);
  });
}

function ensureServerCache(server, obj, json) {
  if (!server.api.enabled) {
    if (obj.last_query_times.server !== json.last_query_times.server.toISOString()) {
      return writeCache(server, json);
    }
  }
}

function ensureWebCache(server, obj, json) {
  if (server.api && server.api.enabled) {
    if (obj.last_query_times.web !== json.last_query_times.web.toISOString()) {
      return writeCache(server, json);
    }
  }
}

function ensureAllCaches(server, obj, json) {
  if (server.pterodactyl && server.pterodactyl.enabled) {
    if (obj.last_query_times.ptero === json.last_query_times.ptero.toISOString()) {
      ensureWebCache(server, obj, json);
      ensureServerCache(server, obj, json);
    } else {
      return writeCache(server, json);
    }
  }
}

module.exports = {
  writeCache,
  ensureServerCache,
  ensureWebCache,
  ensureAllCaches
};
