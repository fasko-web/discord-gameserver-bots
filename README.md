<p align="center">
  <img src="https://i.imgur.com/0QarNx8.png" alt="Definitive icon" width="250" align="center" />
</p>

<p align="center">
  <a href="https://github.com/fasko-web/discord-gameserver-bots" target="_blank">
    <strong>Discord Gameserver Bots</strong>
  </a>
</p>

<p align="center"><em>Discord.js · Gamedig · Pterodactyl</em></p>

<p align="center">
	<a href="https://github.com/fasko-web/discord-gameserver-bots/releases">
		<img src="https://img.shields.io/github/release/fasko-web/discord-gameserver-bots.svg">
	</a>
	<a href="https://github.com/fasko-web/discord-gameserver-bots/blob/main/LICENSE">
		<img src="https://img.shields.io/github/license/fasko-web/discord-gameserver-bots.svg">
	</a>
  <a href="https://github.com/fasko-web/discord-gameserver-bots/releases/">
    <img src="https://img.shields.io/github/downloads/fasko-web/discord-gameserver-bots/total">
  </a>
	<a href="https://discordapp.com/invite/sB9WZ2f" target="_blank">
		<img src="https://img.shields.io/discord/350480317297197057.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2">
	</a>
</p>

---

An application for creating and managing Discord bots that display information related to your game servers, with a separate commands bot using Discord's new slash commands API.
The purpose of the separate commands bot is to unify all server commands under one bot, which will avoid spamming the commands list with a section for each server. However it also allows commands to be entirely optional!

Each game server can be configured via it's own TOML file within the config directory, with all other options being configured via the `.env` file in the root directory.

---

#### Getting Started
![Discord Bot](https://i.imgur.com/aF89SrI.png)

A Discord bot that updates its activity status to display how many players are currently connected to your game server using SourceQuery or REST API, with Pterodactyl support.

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

#### Linux: Run the bot with pm2.
1. Run `npm install pm2 -g`
2. Run `pm2 start app.js --name <YOUR_SERVER_NAME>`
- Use `pm2 status` to see all pm2 processes
- Use `pm2 monit` to view the log of active pm2 processes
