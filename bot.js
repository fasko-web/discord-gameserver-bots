require('dotenv').config();
const fs = require('fs');
const path = require('path');
const TOML = require('@ltd/j-toml');
const { Client } = require('discord.js');
const query = require('./jobs');

const files = fs.readdirSync('./config', { withFileTypes: true })
  .filter(file => !file.isDirectory() || !file.name.includes('default'));

let servers = [];
files.map(file => {
  const contents = fs.readFileSync(`./config/${file.name}`, 'utf-8');
  const config = TOML.parse(contents, 1.0, '\n');
  if (!config.server[0].enabled) return;

  const server = config.server[0];
  const bot = server.bot;

  if (!server.name || !server.ip || !bot.token) {
    if (!server.name) console.log('[ERROR]', `Server name is required! (${file.name})`);
    if (!server.ip) console.log('[ERROR]', `Server IP is required! (${file.name})`);
    if (!bot.token) console.log('[ERROR]', `Discord bot token is required! (${file.name})`);
    process.exit();
  }

  server.abbr = path.parse(file.name).name;

  if (server.optional) {
    optionalSettings = {
      connectURL: (server.optional.connect_url) ? server.optional.connect_url : false,
      rules: (server.optional.rules_url) ? server.optional.rules : false,
      content: (server.optional.content_url) ? server.content : false,
      discords: (server.optional.discord_ids) ? server.discords : false
    }
  }

  servers.push({
    name: server.name || 'Game Server',
    abbr: server.abbr,
    color: (server.bot.color) ? server.bot.color : '#00ADFF',
    ...optionalSettings
  })

  const client = new Client();

  client.on('ready', () => {
    query(client.user.id, server).then(res => {
      client.user.setPresence({
        activity: { name: res.activity, type: server.bot.status.type },
        status: res.status
      });
    });
    setInterval(() => {
      console.log('Interval ran');
      query(client.user.id, server).then(res => {
        client.user.setPresence({
          activity: { name: res.activity, type: server.bot.status.type },
          status: res.status
        });
      });
    }, 5000);
    if (client.user.username !== server.name) client.user.setUsername(server.name);
    console.log('[EVENT]', `${client.user.username} is ready!`);
    console.log('[INFO]', `Bot Invite URL: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`)
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
    slash.postCommands();
    console.log('[EVENT]', `${client.user.username} is ready!`);
    console.log('[INFO]', `Bot Invite URL: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=280576&scope=applications.commands%20bot`)
  });
  client.ws.on('INTERACTION_CREATE', async request => {
    const interaction = new Slash.Interaction(client, request);
    slash.matchCommand(interaction);
  });
  client.login(process.env.COMMAND_BOT_TOKEN);
} else {
  console.log('[WARN]', 'No bot token provided in the .env, commands disabled! (COMMAND_BOT_TOKEN)')
}
