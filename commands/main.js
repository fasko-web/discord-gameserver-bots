require('dotenv').config();
const jf = require('jsonfile');
const Slash = require('da-slash');
const { MessageEmbed } = require('discord.js');
const { servers } = require('../bot.js');
const commandEmbed = require('../utils/embeds.js');

const serversConnect = servers.filter(server => server.connectURL);
const serversDiscord = servers.filter(server => server.discords);
const infoCommand = {
  name: 'info',
  description: `Displays information about one of ${process.env.COMMUNITY_NAME || 'our'} game servers.`,
  type: 1,
  options: [{
    name: 'server',
    description: 'Choose a game server to get the information for.',
    type: 3,
    required: true,
    choices: servers.map(server => {
      return { name: server.name, value: server.abbr }
    })
  }]
};

const connectCommand = {
  name: 'connect',
  description: `Connect to one of ${process.env.COMMUNITY_NAME || 'our' } game servers.`,
  type: 1,
  options: [{
    name: 'server',
    description: 'Choose a game server to connect to.',
    type: 3,
    required: true,
    choices: serversConnect.map(server => {
      return { name: server.name, value: server.abbr }
    })
  }]
};

const discordCommand = {
  name: 'discords',
  description: `Displays any discords related to one of ${process.env.COMMUNITY_NAME || 'our'} game servers.`,
  type: 1,
  options: [{
    name: 'server',
    description: 'Choose a game server to get the discords for.',
    type: 3,
    required: true,
    choices: serversDiscord.map(server => {
      return { name: server.name, value: server.abbr }
    })
  }]
};

let commands;
switch(true) {
  case (serversConnect.length > 0 && serversDiscord.length > 0):
    commands = [
      infoCommand,
      connectCommand,
      discordCommand
    ];
    break;
  case (serversConnect.length > 0):
    commands = [
      infoCommand,
      connectCommand
    ];
    break;
  case (serversDiscord.length > 0):
    commands = [
      infoCommand,
      discordCommand
    ];
    break;
  default:
    commands = [
      infoCommand
    ];
}

const options = {
  name: process.env.COMMAND_BOT_PREFIX || 'server',
  description: `Commands related to ${process.env.COMMUNITY_NAME || 'our'} game servers.`,
  ...( process.env.COMMAND_GUILD_IDS && { guilds: process.env.COMMAND_GUILD_IDS.split(',') }),
  permissions: ['SEND_MESSAGES'],
  options: commands,
  async execute(interaction) {
    interaction.responseType = ((process.env.SHOW_USER_INPUT === 'true') ? 4 : 3);
    const request = interaction.request;
    const subCommand = request.data.options[0];
    const arguments = subCommand.options.map(arg => { return { name: arg.name, value: arg.value }});
    if (arguments.find(arg => arg.name === 'server') && !arguments.find(arg => arg.name === 'server').value) return;
    console.log(subCommand.name, request.data);
    const serverAbbr = arguments.find(arg => arg.name === 'server').value;
    const client = interaction.client;
    const guild = await interaction.guild();
    const author = `${request.member.user.username}#${request.member.user.discriminator}`;

    const cache = jf.readFileSync(`./cache/${serverAbbr}.json`);
    const server = servers.find(server => server.abbr === serverAbbr);
    const serverBot = await client.users.fetch(cache.bot_id);

    const data = {
      serverBot: serverBot,
      guild: guild,
      author: author,
      server: server,
      cache: cache
    };

    if (subCommand.name === 'discords') {
      let discords = server.discords.filter(discord => discord.invite_code).map(discord => {
        return `\n**${discord.name}**\nhttps://discord.gg/${discord.invite_code}\n`
      }).join('');
      interaction.sendMessage(`<@${request.member.user.id}>\n${server.name} related Discords can be found below:\n${discords}`
      );
    } else {
      let embed = new MessageEmbed().setColor(server.color);
      embed = commandEmbed(subCommand.name, embed, data);
      interaction.sendEmbed({
        ...(process.env.SHOW_USER_INPUT === 'false' && { content: `<@${request.member.user.id}>` }),
        embed
       }).then(console.log).catch(console.error);
    }
  }
}

if (process.env.COMMAND_GUILD_IDS) {
  module.exports = new Slash.GuildCommand(options)
} else {
  module.exports = new Slash.GlobalCommand(options)
}
