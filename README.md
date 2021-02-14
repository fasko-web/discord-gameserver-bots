<p align="center">
  <img src="https://i.imgur.com/0IjxJAx.png" alt="Discord Gameserver Bots" width="250" align="center" />
</p>

<p align="center">
  <a href="https://github.com/fasko-web/discord-gameserver-bots" target="_blank">
    <strong>Discord Gameserver Bots</strong>
  </a>
</p>

<p align="center"><em>Discord.js (da-slash) · Gamedig · Pterodactyl</em></p>

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

An application for creating and managing Discord bots that display information related to your game servers; with a separate optional commands bot using Discord's new slash commands API.

<p align="center"><img src="https://i.imgur.com/gAhT9ag.png" alt="Previews"/></p>

---

### Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Create your Discord applications](#1-create-your-discord-applications-)
  - [Configure your .env](#2-configure-your-env-)
  - [Configure your game servers](#3-configure-your-game-servers-)
  - [Install dependencies](#4-install-dependencies-)
  - [Start the bots](#5-start-the-bots-)
  - [Using PM2 (Runs Forever)](#using-pm2)
- [Removing Commands](#-removing-commands)
- [Reporting Errors](#-reporting-errors)
- [Contributing](#contributing)

---

### Features
- Supports any [GameDig compatible game server](https://github.com/gamedig/node-gamedig#supported), or json API
- Optional [Pterodactyl Panel](https://pterodactyl.io/) API Integration
  - Provides "starting" and "stopping" statuses
  - Supports v0.7 and v1+ APIs
- Optional commands bot featuring Discord's new [slash commands](https://discord.com/developers/docs/interactions/slash-commands)
- Custom query intervals <sup>(5 seconds minimum)</sup>
- Individual server configuring via [TOML](https://toml.io/)
  - Toggle whether to show the map/players in your status
  - Provide Discords associated with a game server
  - Set links to a connection redirect, rules, and content

---

### Getting Started
Ensure you have [Node.js](https://nodejs.org/) v12 or higher installed, then download this repository.
- You can check your Node's version by running `node -v`

#### 1. [Create your Discord applications](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) 📝
Invite links for each bot are logged in the console upon startup.

If you wish to invite the bots now though, the only requirement for status bots is the bot scope, while the commands bot should use the following link:
```
https://discord.com/api/oauth2/authorize?client_id=<YOUR_DISCORD_CLIENT_ID>&permissions=280576&scope=applications.commands+bot
```

#### 2. Configure your `.env` ⚙️
Either rename `.env.example` to `.env`, or create a new file in the root directory named `.env` with the contents below:
```env
COMMUNITY_NAME =

COMMAND_BOT_PREFIX = server
COMMAND_BOT_TOKEN =
COMMAND_GUILD_IDS =
SHOW_USER_INPUT = false

SERVER_QUERY_INTERVAL = 1 minute
WEB_QUERY_INTERVAL = 30 seconds
PTERODACTYL_QUERY_INTERVAL = 15 seconds
```

<details>
  <summary>
    Environment Config Details
  </summary>
  <p></p>

Config Name | Information
----------: | -----------
`COMMUNITY_NAME` | Used in command descriptions and some responses. Default: `our`
`COMMAND_BOT_PREFIX` | The prefix to use after the slash(/) to make game server related commands popup quicker. Default: `server`
`COMMMAND_BOT_TOKEN` | The Discord bot token for the application that'll be handling your slash commands. Only required if you intend to use commands. Default: `false`
`COMMAND_GUILD_IDS` | The Discord guild IDs separated by commas (no spaces!) that your commands bot will be in. Only required if you want to post slash commands to your guilds instead of globally, since global slash commands can take awhile to update. Default: `global`
`SHOW_USER_INPUT` | Toggles whether Discord will reply back with the command used, alongside the bot's response. Default: `false`
`SERVER_QUERY_INTERVAL` | The interval your game server will be queried. Only required if you're not using a web API. Default: `1 minute`
`WEB_QUERY_INTERVAL` | The interval your web API will be queried. Only required if you're not using the server query. Default: `30 seconds`
`PTERODACTYL_QUERY_INTERVAL` | The interval your Pterodactyl Panel's API will be queried. Only required if you plan on using it. This should always be set lower than your server or API query interval. Default: `15 seconds`

</details>

#### 3. Configure your game servers 🛠️
1. Create a new `.toml` file within the config directory with your server's abbreviation as the name.
    - Example: `/config/drp.toml`
2. Copy the contents of `/config/default.toml` to your new server's configuration file, and configure it to your liking.

<details>
  <summary>
    Server Config Details
  </summary>
  <p></p>

##### Server Settings - `server`
Config Name | Information
----------: | -----------
`enabled` | Toggles the server's status bot on or off. Default: `true`
`name` | Your server's name. Discord bot will set this as their username and nickname. Discord limits username changes to four an hour. Default: `"Game Server"`
`game` | The game your server is running on. Must be supported by [GameDig](https://github.com/gamedig/node-gamedig#games-list). Default: `'garrysmod'`
`ip` | Your game server's IP address.
`port` | Your game server's port. Set to false if unused. Default: `27015`


##### Bot Settings - `server.bot`
Config Name | Information
----------: | -----------
`token` | The bot token for this game server's Discord bot.
`color` | The color to use for embeds associated with this game server. Default: `'#00ADFF'`
`status.type` | The type of status for your game server's Discord bot. See available options [here](https://discord.js.org/?source=post_page---------------------------#/docs/main/stable/typedef/ActivityType). Default: `'PLAYING'`
`status.players` | Toggles the current and max players in your game server's Discord bot's status. Default: `true`
`status.map` | Toggles the current map in your game server's Discord bot's status. Default: `true`

##### Web API Settings - `server.api`
Config Name | Information
----------: | -----------
&nbsp; | **Only use if you wish to fetch data from an existing API.**
`enabled` | Toggles the option to use a web API instead of querying your server directly. Default: `false`
`url` | If web API is enabled, this should be the full URL to your game server's data in JSON form.
`server_id` | If web API is enabled, and it contains multiple servers in one page, use this to get your server by key or index. (If searching by index, don't enclose in quotes) Default: `0`

##### Pterodactyl Settings - `server.pterodactyl`
Config Name | Information
----------: | -----------
&nbsp; | **Only use if your game server is hosted on a Pterodactyl Panel.**
`enabled` | Toggles whether to query a specified Pterodactyl Panel for 'starting' and 'stopping' statuses. Default: `false`
`version` | If Pterodactyl is enabled, set to 'new' to support Pterodactyl Panel v1.0+ API. Default: `'old'`
`url` | If Pterodactyl is enabled, this should be the root location to your panel, without a trailing slash.
`server_id` | If Pterodactyl is enabled, this will be your game server's public ID as shown on the server list page.
`api_key` | If Pterodactyl is enabled, this should be a secret key generated by your Pterodactyl account to access its API.

##### Optional Settings - `server.optional`
Config Name | Information
----------: | -----------
`connect_url` | Unfortunately Discord doesn't support steam://, however you can set up a simple redirect from a path at your own domain, to a steam:// address, then set it here. Enables `/<prefix> connect` commands for associated game server.
`rules_url` | A link to your game server's rules if needed.
`content_url` | A link to the content pack associated with your game server if needed.
`discords` | An array of Discords associated with your game server. Invite code should be the random letters following discord.gg/(Invite Code). Format: `{ name = '', invite_code = '' }` (Name defaults to server's name + ' Discord')

</details>

#### 4. Install dependencies 📥
```bash
npm ci
```

#### 5. Start the bots 🎉
```bash
npm start
```
Your bots will now be online and displaying their server's status!

<details>
  <summary id="using-pm2">
    <b>Using PM2 (Runs forever)</b>
  </summary>
  <p></p>

[PM2](https://pm2.keymetrics.io/) is a process manager loaded with tons of features, that helps to keep your application online.

##### 1. Install the latest version of PM2 globally
```bash
npm i pm2@latest -g
```

##### 2. Add the bot to your PM2 list and start it
```bash
pm2 start bot.js --name discord-gameserver-bots
```
Your bots will now come back online automatically if your server happens to go down!

- You can find a list of helpful PM2 commands [here](https://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet).

If you plan on having a single server with multiple applications, or already do, then I highly recommend trying out [CapRover](https://caprover.com/); an application/database deployment/web service manager including a web GUI, with support for Nginx, SSL, Netdata, and Docker.

</details>

---

#### 🗑️ Removing commands
If you're removing the bot from your server, then you'll probably want to delete the commands left behind as well.
```bash
npm run delete
```

---

#### 🛑 Reporting errors
If you receive any errors that you are unable to debug, please submit a new issue in this repository with your console's error log. Make sure it contains no sensitive information!

---

### Contributing
I still haven't gotten into linters or actually maintaining a consistent code style for each language, so contributing is pretty straight forward. Just PR anything you feel could be useful or improved, and I'll happily look over and merge it.

If you just want to share an idea, feel free to do so in [discussions](https://github.com/fasko-web/discord-gameserver-bots/discussions/categories/ideas).
