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

#### Features
- Supports any GameDig compatible server, or json API
- Optional Pterodactyl Panel API Integration
  - Provides "starting" and "stopping" statuses
  - Supports v0.7 and v1+
- Configurable query intervals
- Server configuring via [TOML](https://toml.io/)

---

#### Getting Started
Ensure you have [Node.js](https://nodejs.org/) v12 or higher installed, then download this repository.
- You can check your Node's version by running `node -v`

##### 📝 [Create your Discord applications](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
When inviting your bots to your server, status bots don't require any permissions, however if you wish to use the commands bot, you should use the following link:
```
https://discord.com/api/oauth2/authorize?client_id=<YOUR_DISCORD_CLIENT_ID>&permissions=280576&scope=applications.commands+bot
```
- Invite links for each bot are logged in console upon startup as well

##### ⚙️ Configure your `.env`
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
Environment Configureables:
- `COMMUNITY_NAME`: defaults to 'our'
- `COMMAND_BOT_PREFIX`: defaults to 'server'
- `COMMMAND_BOT_TOKEN`: leave this blank to disable the commands bot
- `DISCORD_GUILD_IDS`: leave this blank to use global commands (global slash commands can take awhile to update)
- `SHOW_USER_INPUT`: sends the command a user sent to the bot, off by default
- `SERVER_QUERY_INTERVAL`: defaults to one minute
- `API_QUERY_INTERVAL`: defaults to 30 secs
- `PTERODACTYL_QUERY_INTERVAL`: defaults to 15 secs


##### 🛠️ Configure your game servers
1. Create a new `.toml` file within the config directory with your server's abbreviation as the name.
  - Example: `/config/drp.toml`
2. Copy the contents of `/config/default.toml` to your new server's configuration file, and configure it to your liking.

##### 📥 Install dependencies
```node
npm ci
```

##### 🎉 Start the bots
```node
npm start
```
As long as your console isn't printing any errors, your bots will now be online and displaying their server's status!

###### Reporting Errors
If you receive any errors that you are unable to debug, please submit a new issue in this repository with your console's error log. Make sure it contains no sensitive information!

---

#### Using PM2
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

You can find a list of helpful PM2 commands [here](https://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet).

If you plan on having a single server with multiple applications, or already do, then I highly recommend trying out [CapRover](https://caprover.com/); an application/database deployment/web service manager including web GUI, with support for Nginx, SSL, Netdata, and Docker.

---

#### Authors
[![Contributors Display](https://badges.pufler.dev/contributors/fasko-web/discord-gameserver-bots?size=50&padding=5&bots=true)](https://badges.pufler.dev)
