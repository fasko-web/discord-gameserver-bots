const { MessageEmbed } = require('discord.js');

module.exports = (command, embed, d) => {
  const data = {
    status: {
      on: '<:online:765156793986580480> Online',
      off: '<:dnd:765156807231930369> Offline',
      starting: '<:idle:765156832015941662> Starting',
      stopping: '<:idle:765156832015941662> Stopping',
      unknown: '<:dnd:765156807231930369> Panel Error'
    },
    players: {
      on: (d.cache.max_players !== 'N/A') ? `${d.cache.players}/${d.cache.max_players}` : 'Fetching Info..',
      off: 'N/A',
      starting: 'Awaiting Info..',
      stopping: 'N/A',
      unknown: 'N/A'
    },
    map: {
      on: (d.cache.map !== 'N/A') ? d.cache.map : 'Fetching Info..',
      off: 'N/A',
      starting: 'Awaiting Info..',
      stopping: 'N/A',
      unknown: 'N/A'
    }
  }
  switch(command) {
    case 'info':
      embed.setAuthor(`${d.serverBot.username} - Information`, d.serverBot.displayAvatarURL(16))
        .addFields([
          { name: 'Status',  value: data.status[d.cache.current_state] },
          { name: 'Address', value: d.cache.connect },
          { name: 'Players', value: data.players[d.cache.current_state] },
          { name: 'Map',     value: data.map[d.cache.current_state] }
        ]);
      if (d.server.rules || d.server.content) {
        if (d.server.rules && d.server.content) {
          embed.addFields([
            { name: 'Rules',   value: `[Server Rules](${d.server.rules})`,     inline: true },
            { name: 'Content', value: `[Server Content](${d.server.content})`, inline: true }
          ]);
        } else if (d.server.rules) {
          embed.addField('Rules', `[Server Rules](${d.server.rules})`, true);
        } else if (d.server.content) {
          embed.addField('Content', `[Server Content](${d.server.content})`, true);
        }
      }
      break;
    case 'connect':
      switch(true) {
        case (d.cache.current_state === 'on' || d.cache.current_state === 'starting'):
          embed.setAuthor(`Connect to ${d.serverBot.username}`, d.serverBot.displayAvatarURL(16), d.server.connectURL)
            .setFooter("You'll be redirected to your browser, then Steam.")
          break;
        case (d.cache.current_state === 'off' || d.cache.current_state === 'stopping'):
          embed.setAuthor(`Can't connect to ${d.serverBot.username} while it's offline.`, d.serverBot.displayAvatarURL(16))
      }
      break;
    default:
      embed.setAuthor("ERROR - This command doesn't exist yet!")
  }
  return embed;
}
