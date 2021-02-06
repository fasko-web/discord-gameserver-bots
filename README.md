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

An application for creating and managing Discord bots that display information related to your game servers; with a separate optional commands bot using Discord's new slash commands API.

![Discord Bot](https://i.imgur.com/aF89SrI.png)

---

### Features
- Supports any [GameDig compatible game server](https://github.com/gamedig/node-gamedig#supported), or json API
- Optional [Pterodactyl Panel](https://pterodactyl.io/) API Integration
  - Provides "starting" and "stopping" statuses
  - Supports v0.7 and v1+ APIs
- Optional commands bot featuring Discord's new [slash commands](https://discord.com/developers/docs/interactions/slash-commands)
- Custom query intervals <span style="font-size:small">(be safe kids)</span>
- Individual server configuring via [TOML](https://toml.io/)
  - Toggle whether to show the map or players in your status
  - Provide IDs of Discords associated with a game server
  - Set links to a connection redirect, rules, and content

---

### Getting Started
Ensure you have [Node.js](https://nodejs.org/) v12 or higher installed, then download this repository.
- You can check your Node's version by running `node -v`

#### 📝 [Create your Discord applications](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
Invite links for each bot are logged in the console upon startup.

If you wish to invite the bots now though, the only requirement for status bots is the bot scope, while the commands bot should use the following link:
```
https://discord.com/api/oauth2/authorize?client_id=<YOUR_DISCORD_CLIENT_ID>&permissions=280576&scope=applications.commands+bot
```

#### ⚙️ Configure your `.env`
Either rename `.env.example` to `.env`, or create a new file in the root directory named `.env` with the contents below:
```env
COMMUNITY_NAME =

COMMAND_BOT_PREFIX = server
COMMAND_BOT_TOKEN =
DISCORD_GUILD_IDS =
SHOW_USER_INPUT = false

SERVER_QUERY_INTERVAL = 1 minute
API_QUERY_INTERVAL = 30 secs
PTERODACTYL_QUERY_INTERVAL = 15 seconds
```
<details>
<summary>
Environment Config Details
</summary>
<p></p>

Config Name | Information
------------|------------
`COMMUNITY_NAME` | Used in command descriptions and some responses. Default: `our`
`COMMAND_BOT_PREFIX` | The prefix to use after the slash(/) to make game server related commands popup quicker. Default: `server`
`COMMMAND_BOT_TOKEN` | The Discord bot token for the application that'll be handling your slash commands. Only required if you intend to use commands. Default: `false`
`COMMAND_GUILD_IDS` | The Discord guild IDs separated by commas (no spaces!) that your commands bot will be in. Only required if you want to post slash commands to your guilds instead of globally, since global slash commands can take awhile to update. Default: `global`
`SHOW_USER_INPUT` | Toggles whether Discord will reply back with the command used, alongside the bot's response. Default: `false`
`SERVER_QUERY_INTERVAL` | The interval your game server will be queried. Only required if you're not using a web API. Default: `one minute`
`API_QUERY_INTERVAL` | The interval your web API will be queried. Only required if you're not using the server query. Default: `30 secs`
`PTERODACTYL_QUERY_INTERVAL` | The interval your Pterodactyl Panel's API will be queried. Only required if you plan on using it. Default: `15 secs`

</details>

#### 🛠️ Configure your game servers
1. Create a new `.toml` file within the config directory with your server's abbreviation as the name.
    - Example: `/config/drp.toml`
2. Copy the contents of `/config/default.toml` to your new server's configuration file, and configure it to your liking.

#### 📥 Install dependencies
```node
npm ci
```

#### 🎉 Start the bots
```node
npm start
```
As long as your console isn't printing any errors, your bots will now be online and displaying their server's status!

##### 🛑 Reporting errors
If you receive any errors that you are unable to debug, please submit a new issue in this repository with your console's error log. Make sure it contains no sensitive information!

---

<details>
  <summary>
    <h4 style="display: inline-block;">Using PM2 (Runs forever)</h4>
  </summary>

[PM2](https://pm2.keymetrics.io/) is a process manager loaded with tons of features, that helps to keep your application online.
##### 1. Install the latest version of PM2 globally
```node
npm i pm2@latest -g
```

##### 2. Add the bot to your PM2 list and start it
```node
pm2 start bot.js --name discord-gameserver-bots
```
Your bots will now come back online automatically if your server happens to go down!

- You can find a list of helpful PM2 commands [here](https://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet).

If you plan on having a single server with multiple applications, or already do, then I highly recommend trying out [CapRover](https://caprover.com/); an application/database deployment/web service manager including web GUI, with support for Nginx, SSL, Netdata, and Docker.
</details>

---

#### Contributing
I still haven't gotten into linters or actually maintaining a consistent code style for each language, so contributing is pretty straight forward. Just PR anything you feel could be useful or improved, and I'll happily look over and merge it.

If you just want to share an idea, feel free to do so in [discussions](https://github.com/fasko-web/discord-gameserver-bots/discussions/categories/ideas).
