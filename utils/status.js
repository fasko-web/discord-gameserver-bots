



function updateStatus(server) {
  switch(server.api.type) {
    case 'web':
      if (!server.api.url) {
        console.log('[ERROR]', 'API URL required for web REST API functionality!')
        process.exit()
      }
      break;
    case 'source':
      if (server.ip || server.port) {
        sq = new SourceQuery(5000)
        sq.open(server.ip, server.port)
      } else {
        console.log('[ERROR]', 'Server IP/Port required!')
        process.exit()
      }
  }
}

function ifPterodactyl() {
  
}
