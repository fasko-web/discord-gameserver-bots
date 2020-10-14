const Discord = require("discord.js")
const needle = require('needle')
const SourceQuery = require('sourcequery')
const fs = require('fs');

const configdir = './config';
const maxServers = 10;

// Create dir if not exist
if (!fs.existsSync(configdir)){
    fs.mkdirSync(configdir);
}

// Create config file if not exist
fs.readdir(configdir, (err, files) => {
    try {
        if (files.length < 1 )
        var writeConfig = '{"debug": false,"token": "Discord bot token","prefix": ".","embedColor": "#00adff","statusType": "","apiType": 2,"apiUrl": "https://example.com/api","serverId": 0,"serverIp": "","serverPort": "27015","enablePterodactyl": 0,"pterodactylHost": "https://example.com/","pterodactylServer": "","pterodactylKey": ""}'
        var jsonData = JSON.parse(writeConfig);

        fs.writeFile("config/server1.json", JSON.stringify(jsonData, null, 2), 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("Config file created");
        });
    } catch (error) {

    }
});

fs.readdir(configdir, (err, files) => {

    for (var i = 1; i <= files.length; i++){
        if (i > maxServers) {
        console.log("Max servers is over " + maxServers)
        console.log("Please verify max servers and try again")
        process.exit()
        }

        let status
        let map
        let playerCount
        let pteroInterval
        let sq
        let wapi;

        // Functions
        function updateActivity() {

          if (apiType == 1) {
            if (!apiUrl) {
              console.log('API URL required for REST API functionality!')
              process.exit()
            }
          }

          if (apiType == 2) {
            if (!serverIp || !serverPort) {
              console.log('Server IP/Port required for SourceQuery functionality!')
              process.exit()
            } else {
              sq = new SourceQuery(1000) // 1000ms timeout
              sq.open(serverIp, serverPort)
            }
          }

          if (enablePterodactyl == 1 ) {
            function pteroQuery() {
              var query = needle.get(pterodactylHost + 'api/client/servers/' + pterodactylServer + '/utilization',
                {
                  headers: {
                    Referer: 'discord-sourceserverstatus',
                    Authorization: 'Bearer ' + pterodactylKey,
                    Accept: 'Application/vnd.pterodactyl.v1+json'
                  },
                  timeout: 10000
                },
                function(error, response, body) {
                  if (!error && response.statusCode == 200) {
                    let state = body.attributes.state;

                    switch (state) {
                      case 'on':
                        if (debug) console.log(`Pterodactyl: ${serverIp}:${serverPort}(${pterodactylServer}) is Online`)
                        status = '🟢 Online'

                        switch(apiType) {

                          case 1: // REST API + Pterodactyl
                            needle.get(apiUrl, { headers: { Referer: 'discord-sourceserverstatus' }, timeout: 10000 }, function(error, response, body) {
                              if(!error && response.statusCode == 200) {
                                const server = body[serverId];
                                if (server.map !== 'N/A') {

                                  if (debug) { console.log('Web API: \nIP: %s\nPort: %s\nPlayers: %s/%s', serverIp, serverPort, server.players, server.maxPlayers) }
                                  const players = server.players
                                  const maxPlayers = server.maxPlayers
                                  playerCount = `${players}/${maxPlayers}`
                                  return client.user.setPresence({ activity: { name: playerCount, type: statusType }, status: 'online' });

                                } else {

                                  if (debug) console.log(`Web API: ${serverIp}:${serverPort} is offline.`)
                                  playerCount = "Fetching Info.."
                                  return client.user.setPresence({ activity: { name: playerCount, type: statusType }, status: 'idle' });

                                }
                              } else if (response.statusCode == 429) {
                                console.log(`Web API [ERROR]: ${serverIp}:${serverPort} ${response.statusCode} Too Many Requests`);
                              } else if (response) {
                                if (response.statusCode) {console.log(response.statusCode)}
                                if (response.headers) {console.log(response.headers)}
                              }
                            })
                            break;

                          case 2: // SourceQuery + Pterodactyl
                            sq.getInfo(function(err, info) {
                              if (!err) {

                                if (debug) { console.log('SourceQuery: \nIP: %s\nPort: %s\nName: %s\nPlayers: %s/%s', serverIp, serverPort, info.name, info.players, info.maxplayers) }
                                map = info.map
                                const players = info.players
                                const maxPlayers = info.maxplayers
                                playerCount = `${players}/${maxPlayers}`
                                return client.user.setPresence({ activity: { name: playerCount, type: statusType }, status: 'online' });

                              } else {

                                if (debug) console.log(`SourceQuery: ${serverIp}:${serverPort}(${pterodactylServer}) failed to fetch info`)
                                map = 'Unavailable'
                                playerCount = "Fetching Info.."
                                return client.user.setPresence({ activity: { name: playerCount, type: statusType }, status: 'idle' });

                              }
                            })
                        }
                        break;
                      case 'starting':
                        if (debug) console.log(`Pterodactyl: ${serverIp}:${serverPort}(${pterodactylServer}) is Starting`)
                        status = '🟡 Starting'
                        map = "N/A"
                        playerCount = "N/A"
                        return client.user.setPresence({ activity: { name: 'Server Starting', type: statusType }, status: 'idle' });
                        break;
                      case 'stopping':
                        if (debug) console.log(`Pterodactyl: ${serverIp}:${serverPort}(${pterodactylServer}) is Stopping`)
                        status = '🟡 Stopping'
                        map = "N/A"
                        playerCount = "N/A"
                        return client.user.setPresence({ activity: { name: 'Server Stopping', type: statusType }, status: 'idle' });
                        break;
                      case 'off':
                        if (debug) console.log(`Pterodactyl: ${serverIp}:${serverPort}(${pterodactylServer}) is Offline`)
                        status = '🔴 Offline'
                        map = "N/A"
                        playerCount = "N/A"
                        return client.user.setPresence({ activity: { name: 'Server Offline', type: statusType }, status: 'dnd' });
                    }
                  } else if (response.statusCode == 429) {
                    console.log(`Pterodactyl [ERROR]: ${serverIp}:${serverPort}(${pterodactylServer}) ${response.statusCode} Too Many Requests`);
                  } else if (response) {
                    if (response.statusCode) {console.log(response.statusCode)}
                    if (response.headers) {console.log(response.headers)}
                  }
                }
              );

              var queryTime = new Promise(function(resolve, reject) {
                // Change the time to query Pterodactyl here
                pteroInterval = setTimeout(resolve, 10000);
              });

              Promise.all([query, queryTime]).then(function(values) {
                pteroQuery();
              });
            }
            pteroQuery();
          } else {
            switch(apiType) {

              case 1: // Rest API

                needle.get(apiUrl, { headers: { Referer: 'discord-sourceserverstatus' }, timeout: 10000 }, function(error, response, body) {
                  if(!error && response.statusCode == 200) {
                    const server = body[serverId];
                    if (server.status == 'online') {
                      if (debug) { console.log('Web API: \nIP: %s\nPort: %s\nPlayers: %s/%s', serverIp, serverPort, server.players, server.maxPlayers) }
                      status = '🟢 Online'
                      const players = server.players
                      const maxPlayers = server.maxPlayers
                      playerCount = `${players}/${maxPlayers}`
                      return client.user.setPresence({ activity: { name: playerCount, type: statusType }, status: 'online' });
                    } else {
                      if (debug) console.log(`Web API: ${serverIp}:${serverPort} is offline.`)
                      status = '🔴 Offline'
                      playerCount = "N/A"
                      return client.user.setPresence({ activity: { name: 'Offline', type: statusType }, status: 'dnd' });
                    }
                  } else {
                    console.log(`Web API [ERROR]: ${serverIp}:${serverPort} Status Code - ${response.statusCode}`);
                  }
                })
                break;

              case 2: // SourceQuery

                  sq.getInfo(function(err, info) {

                    if (!err) {
                      if (debug) { console.log('Source Query: \nIP: %s\nPort: %s\nName: %s\nPlayers: %s/%s', serverIp, serverPort, info.name, info.players, info.maxplayers) }
                      status = '🟢 Online'
                      map = info.map
                      const players = info.players
                      const maxPlayers = info.maxplayers
                      playerCount = `${players}/${maxPlayers}`
                      return client.user.setPresence({ activity: { name: playerCount, type: statusType }, status: 'online' });
                    } else {
                      if (debug) console.log(`SourceQuery: ${serverIp}:${serverPort}(${pterodactylServer}) failed to fetch info`)
                      status = '🔴 Offline'
                      map = "N/A"
                      playerCount = "N/A"
                      return client.user.setPresence({ activity: { name: 'Offline', type: statusType }, status: 'dnd' });
                    }
                  })

            }
          }
        }
        // End Functions

        try {
            var config = require("./config/server"+i+".json");
        } catch (error) {

        }
        const client = new Discord.Client()

        const debug = process.env.debug || config.debug
        const prefix = process.env.prefix || config.prefix
        const embedColor = process.env.embedColor || config.embedColor
        const statusType = process.env.statusType || config.statusType
        const apiUrl = process.env.apiUrl || config.apiUrl
        const apiType = process.env.apiType || config.apiType
        const serverId = process.env.serverId || config.serverId
        const serverIp = process.env.serverIp || config.serverIp
        const serverPort = process.env.serverPort || config.serverPort
        const enablePterodactyl = process.env.enablePterodactyl || config.enablePterodactyl
        const pterodactylHost = process.env.pterodactylHost || config.pterodactylHost
        const pterodactylServer = process.env.pterodactylServer || config.pterodactylServer
        const pterodactylKey = process.env.pterodactylKey || config.pterodactylKey

        client.on("ready", () => {
            console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`)
            client.user.setPresence({ activity: { name: 'Fetching Info..', type: statusType }, status: 'idle' });
            updateActivity()
            setInterval(function () {
                clearTimeout(pteroInterval);
                updateActivity()
            }, 1000 * 60)
        })


        // Server Info Embed
        client.on("message", async message => {

            if(message.author.bot) return
            if(message.content.indexOf(prefix) !== 0) return

            var args = message.content.slice(prefix.length).trim().split(/ +/g)
            var command = args.shift().toLowerCase()

            if(command === "status") {

                // Send message back to discord that we are trying to relay the command.
                let statusEmbed;
                if (map) {
                  statusEmbed = new Discord.MessageEmbed()
                    .setColor(embedColor)
                    .setTitle('Server Info')
                    .addFields(
                      { name: 'Status', value: status, inline: true },
                      { name: '\u200B', value: '\u200B', inline: true },
                      { name: 'Address', value: `${serverIp}:${serverPort}`, inline: true },
                      { name: 'Players', value: playerCount, inline: true },
                      { name: '\u200B', value: '\u200B', inline: true },
                      { name: 'Map', value: map, inline: true }
                    );
                } else {
                  statusEmbed = new Discord.MessageEmbed()
                    .setColor(embedColor)
                    .setTitle('Server Info')
                    .addFields(
                      { name: 'Status', value: status, inline: true },
                      { name: '\u200B', value: '\u200B', inline: true },
                      { name: 'Players', value: playerCount, inline: true },
                      { name: 'Address', value: `${serverIp}:${serverPort}`, inline: true }
                    );
                }

                message.channel.send(statusEmbed);
            }
        })

        // Log when joining new Guild
        client.on("guildCreate", guild => {
        console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
        })

        // Log when removed from Guild
        client.on("guildDelete", guild => {
        console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
        })

        // Log errors if debug is on
        client.on('error', function (error) {
        if (debug) console.log(error)
        })

        // Log token errors
        process.on('unhandledRejection', error => {
            if (error.code == 'TOKEN_INVALID')
                return console.log("Error: An invalid token was provided.\nYou have maybe added client secret instead of BOT token.\nPlease set BOT token")

            return console.error('Unhandled promise rejection:', error);
        });

        client.login(process.env.token || config.token)
    }
});
