require('dotenv').config();
const { Client } = require('discord.js');
const Slash = require('da-slash');

const client = new Client();
const slash = new Slash.Client(client, { commands: { directory: 'commands' }});

if (process.env.COMMAND_BOT_TOKEN) {
  client.on('ready', () => {
    slash.deleteCommands(client.guilds.cache.map(guild => guild.id), true).then(
      console.log('[EVENT]', `Deleted commands for ${client.user.username}! (Global commands may take an hour or more to delete)`)
    );
    console.log('[INFO]', `Bot Invite URL: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=280576&scope=applications.commands%20bot`)
  });
  client.login(process.env.COMMAND_BOT_TOKEN);
} else {
  console.log('[WARN]', 'No bot token provided in the .env, unable to delete commands! (COMMAND_BOT_TOKEN)')
}
