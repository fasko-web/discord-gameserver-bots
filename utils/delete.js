require('dotenv').config();
const fs = require('fs');
const { Client } = require('discord.js');
const Slash = require('da-slash');

const client = new Client();
const slash = new Slash.Client(client, { commands: { directory: 'commands' }});

if (process.argv[2]) {
  if (process.argv[2] === 'commands') {
    if (process.env.COMMAND_BOT_TOKEN) {
      client.on('ready', () => {
        console.log('[INFO]', `Bot Invite URL: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=280576&scope=applications.commands%20bot`)
        slash.deleteCommands(client.guilds.cache.map(guild => guild.id), true).then(() => {
          console.log(`Deleted commands for ${client.user.username}! (Global commands may take an hour or more to delete)`);
          process.exit();
        });
      });
      client.login(process.env.COMMAND_BOT_TOKEN);
    } else {
      console.log('No bot token provided in the .env, unable to delete commands! (COMMAND_BOT_TOKEN)')
    }
  } else if (process.argv[2] === 'cache') {
    const cache = fs.readdirSync('./cache', { withFileTypes: true }).filter(file => file.name.endsWith('.json'));
    cache.map(file => {
      console.log('Deleting cache file:', file.name);
      fs.unlink(`./cache/${file.name}`, (err) => {
        if(err) return console.log(err);
      });
    });
    process.exit();
  }
} else {
  console.log('No arguments provided. Must specify cache or commands.');
  process.exit();
}
