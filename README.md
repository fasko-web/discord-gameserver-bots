# Source Server Status 

[![GitHub release](https://img.shields.io/github/release/fasko-web/source-server-status)](https://GitHub.com/fasko-web/source-server-status/releases/)
[![Generic badge](https://img.shields.io/badge/node-12.0-blue.svg)](https://nodejs.org/)
[![Generic badge](https://img.shields.io/badge/discord-js-blue.svg)](https://discord.js.org/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

[![Github all releases](https://img.shields.io/github/downloads/fasko-web/source-server-status/total)](https://github.com/fasko-web/source-server-status/releases/)
[![GitHub issues](https://img.shields.io/github/issues/fasko-web/source-server-status)](https://GitHub.com/fasko-web/source-server-status/issues/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

![Discord-bot](https://i.gyazo.com/23a3f95b758a146efa7d4a3dfd5f3999.png)

## Overview - [Changelog](/changelog.md)

A Discord bot that updates its activity status to display how many players are currently connected to your game server using SourceQuery or REST API, with Pterodactyl support.

Runs on Windows, macOS, and Linux, see Installation section for more info.

Requires npm and nodejs.

- SourceQuery (gets information directly from a Source server)
- REST API Support (similar layout to SourceQuery, except fetches data from URL)
- Pterodactyl Integration (will show when server is starting/stopping)

## Configuration
example_config.json

Location: config/serverX.json (default on first startup: config/server1.json)
```
{
  "debug": false,
  "token": "Discord bot token",
  "prefix": ".",
  "embedColor": "#00adff",
  "statusType": "",
  "apiType": 2,
  "apiUrl": "https://example.com/api",
  "serverId": 0,
  "serverIp": "",
  "serverPort": "27015",
  "enablePterodactyl": 0,
  "pterodactylHost": "https://example.com/",
  "pterodactylServer": "",
  "pterodactylKey": ""
}
```
- token: Your Discord bot's token.
- prefix: The prefix to use for your server's status command
- embedColor: The color your Dicord bot uses for the server's status command
- statusType: Activity type for Discord bot: PLAYING, WATCHING, etc
- apiType:
  - 1 = REST API (URL)
  - 2 = SourceQuery (IP and Port)
- apiUrl: The URL to your server's REST API
- serverId: If your REST API json has multiple server's in it, use this for indexing, otherwise 0 should suffice
- serverIp: The IP to your game server
- serverPort: The port to your game server
- enablePterodactyl:
  - 0 = Disabled
  - 1 = Enabled
- pterodactylHost: The URL to your Pterodactyl panel (with trailing slash)
- pterodactylServer: The server's ID in your Pterodactyl panel
- pterodactylKey: The API key to your Pterodactyl panel

## Installation
**Requirements:**
- [node.js](https://nodejs.org/) >= 12.0
- npm (gets installed w/ node.js)
- Windows/macOS/Linux/~~Docker~~

#### Basic Installation
1. Download the repo as a zip or use git clone https://github.com/fasko-web/source-server-status.git
2. Extract it and open the folder, then open your CLI in the same folder.
3. Run `npm install` (This downloads the required modules from package.json)
	- You should see a new folder called "node_modules"
4. Start the bot with `npm start`, and then stop it.
	- You should see a new folder called "config"
5. Create your Discord bot and invite it to your server.
	- https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
	- https://discordapp.com/developers/applications/me/
	- `https://discordapp.com/oauth2/authorize?&client_id=<YOUR_CLIENT_ID_HERE>&scope=bot&permissions=0`
6. Open "config/server1.json", add your Discord bot\'s token, and configure the rest.
7. Start the bot again with `npm start`, it should now be showing up on Discord.
	- Feel free to check w/ `.<prefix> status`

#### Windows: Install the bot as a windows service.
  - Open powershell: npm install
  - npm install -g node-windows
  - npm link node-windows
  - node installSVC.js
  - You will get some prompt to allow it to install, press yes on all.
  - Open services.msc and see discord-rustserverstatus is started. now it will always start on bootup.

* Uninstall:
  - node uninstallSVC.js
  - Press yes on all prompts

#### Linux: Run the bot with pm2.
1. Run `npm install pm2 -g`
2. Run `pm2 start app.js --name <YOUR_SERVER_NAME>`
- Use `pm2 status` to see all pm2 processes
- Use `pm2 monit` to view the log of active pm2 processes
