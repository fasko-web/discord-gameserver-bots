require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const TOML = require('@iarna/toml');
const { Client } = require('discord.js');
const query = require('./jobs');

const files = fs.readdirSync('./config', { withFileTypes: true }).filter(file => file.name.endsWith('.toml'));

let servers = [];
files.filter(file => !file.name.includes('default')).map(file => {
  const contents = fs.readFileSync(`./config/${file.name}`, 'utf-8');
  const config = TOML.parse(contents);
  if (!config.server.enabled) return console.log(chalk.cyanBright('[INFO]'), `Server disabled. (${chalk.blueBright(file.name)})`);

  const server = config.server;
  const bot = server.bot;

  if (!server.ip || !bot.token) {
    if (!server.ip) console.log(chalk.redBright('[ERROR]'), `Server IP is required! (${chalk.blueBright(file.name)})`);
    if (!bot.token) console.log(chalk.redBright('[ERROR]'), `Discord bot token is required! (${chalk.blueBright(file.name)})`);
    process.exit();
  }

  server.name = server.name || 'Game Server';
  server.abbr = path.parse(file.name).name;
  server.bot.color = server.bot.color || '#00ADFF';

  servers.push({
    name: server.name,
    abbr: server.abbr,
    color: server.bot.color,
    ...(server.optional && {
      connectURL: server.optional.connect_url || false,
      rules: server.optional.rules_url || false,
      content: server.optional.content_url || false,
      discords: server.optional.discords || false
    })
  })

  const client = new Client();

  client.on('ready', () => {
    client.user.setPresence({
      activity: { name: 'Fetching Info..', type: server.bot.status.type || 'PLAYING' },
      status: 'idle'
    });
    let loop = () => {
      query(client.user.id, server).then(res => {
        client.user.setPresence({
          activity: { name: res.activity, type: server.bot.status.type || 'PLAYING' },
          status: res.status
        }).catch(err => console.error(err));
      });
      setTimeout(loop, 5000);
    };
    loop();
  });

  client.once('ready', () => {
    if (client.user.username !== server.name) {
      console.log('[EVENT]', `Changing username/nicknames of ${chalk.magentaBright(client.user.username)} to: ${chalk.blueBright(server.name)}`);
      client.user.setUsername(server.name)
        .then(user => {
          console.log('[EVENT]', `Username set. (${chalk.blueBright(user.username)})`);
          client.guilds.cache.map(guild => {
            if (!guild.member(client.user).hasPermission('CHANGE_NICKNAME')) return;
            if (guild.member(client.user).nickname === server.name) return;
            guild.member(client.user).setNickname(server.name)
              .then(member => console.log('[EVENT]', `Nickname set in ${chalk.magentaBright(guild.name)}. (${chalk.blueBright(member.nickname)})`))
              .catch(err => console.error(err));
          });
        })
        .catch(err => console.error(err));
    }
    client.fetchApplication()
      .then(app => {
        if (app.name !== server.name) {
          console.log(chalk.black.bgYellow('[WARN]'), chalk.black.bgBlueBright(`[${client.user.username}]`), `Bot application requires manual renaming: ${chalk.underline(`https://discord.com/developers/applications/${client.user.id}/information`)}`)
        }
      })
    console.log(chalk.black.bgGreenBright(`${client.user.username} is ready!`));
    console.log(chalk.cyanBright('[INFO]'), `Bot Invite URL: ${chalk.underline(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`)}`);
  });

  client.login(bot.token);
});

// Slash Commands Bot
if (process.env.COMMAND_BOT_TOKEN && servers.length !== 0) {
  module.exports.servers = servers;
  const Slash = require('da-slash');
  const client = new Client();
  const slash = new Slash.Client(client, { commands: { directory: 'commands' }});
  client.on('ready', () => {
    if (process.env.COMMAND_GUILD_IDS) {
      slash.deleteCommands(false, true);
    } else {
      slash.deleteCommands(client.guilds.cache.map(guild => guild.id));
    }
    slash.postCommands();
    console.log('[EVENT]', chalk.greenBright(`${client.user.username} is ready!`));
    console.log(chalk.cyanBright('[INFO]'), `Bot Invite URL: ${chalk.underline(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=280576&scope=applications.commands%20bot`)}`)
  });
  client.ws.on('INTERACTION_CREATE', async request => {
    const interaction = new Slash.Interaction(client, request);
    slash.matchCommand(interaction);
  });
  client.login(process.env.COMMAND_BOT_TOKEN);
} else {
  if (!process.env.COMMAND_BOT_TOKEN) console.log(chalk.black.bgYellow('[WARN]'), `Commands disabled, no ${chalk.yellowBright('COMMAND_BOT_TOKEN')} provided in the .env!`);
}
