const { Client } = require('discord.js');
const Slash = require('da-slash');

if (process.env.COMMAND_BOT_TOKEN && servers.length !== 0) {
  const commandBot = new CommandBot.init(process.env.COMMAND_GUILD_IDS, () => {
    console.log(chalk.greenBright(`${this.client.user.username} is ready!`));
    console.log(this.client.user.username, `Invite URL: ${chalk.underline(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=280576&scope=applications.commands%20bot`)}`);
  });
  commandBot.listen();
  commandBot.client.login(process.env.COMMAND_BOT_TOKEN)
} else if (!process.env.COMMAND_BOT_TOKEN) {
  console.log(chalk.black.bgYellow('[WARN]'), `Commands disabled, no ${chalk.yellowBright('COMMAND_BOT_TOKEN')} provided in the .env!`);
}
////

class CommandsBot {
  constructor() {
    this.client = new Client({ disableMentions: 'everyone' });
    this.slash = new Slash.Client(this.client, { commands: { directory: 'commands' }});
  }
  init(guilds, callback) {
    this.client.once('ready', () => {
      (guilds)
        ? this.slash.deleteCommands(false, true);
        : this.slash.deleteCommands(this.client.guilds.cache.map(guild => guild.id));
      this.slash.postCommands()
        .then(callback)
        .catch(err => console.error(err));
    });
  }
  listen() {
    this.client.ws.on('INTERACTION_CREATE', async request => {
      const interaction = new Slash.Interaction(this.client, request);
      this.slash.matchCommand(interaction);
    });
  }
}
