require('dotenv').config();
const jf = require('jsonfile');
const Slash = require('da-slash');
const { MessageEmbed } = require('discord.js');
const { servers } = require('../bot.js');
const commandEmbed = require('../utils/embeds.js');

const serverChoices = servers.map(server => {
  return { name: server.name, value: server.abbr }
});

module.exports = new Slash.GuildCommand({
  name: process.env.PREFIX || 'server',
  description: `Commands related to ${process.env.COMMUNITY_NAME || 'our'} game servers.`,
  guilds: process.env.DISCORD_GUILD_IDS.split(','),
  permissions: ['SEND_MESSAGES'],
  options: [
    {
      name: 'info',
      description: `Displays information about one of ${process.env.COMMUNITY_NAME || 'our'} game servers.`,
      type: 1,
      options: [{
        name: 'server',
        description: 'Choose a game server to get the information for.',
        type: 3,
        required: true,
        choices: serverChoices
      }]
    },{
      name: 'connect',
      description: `Connect to one of ${process.env.COMMUNITY_NAME || 'our' } game servers.`,
      type: 1,
      options: [{
        name: 'server',
        description: 'Choose a game server to connect to.',
        type: 3,
        required: true,
        choices: serverChoices
      }]
    },{
      name: 'discords',
      description: `Displays any discords related to one of ${process.env.COMMUNITY_NAME || 'our'} game servers.`,
      type: 1,
      options: [{
        name: 'server',
        description: 'Choose a game server to get the discords for.',
        type: 3,
        required: true,
        choices: serverChoices
      }]
    }
  ],
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
    console.log(server);
    const data = {
      serverBot: serverBot,
      guild: guild,
      author: author,
      server: server,
      cache: cache
    };

    if (subCommand.name !== 'discords') {
      let embed = new MessageEmbed().setColor(server.color);
      embed = commandEmbed(subCommand.name, embed, data);
      interaction.sendEmbed(embed).then(console.log).catch(console.error);
    } else {

    }
  }
})
