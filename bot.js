const fs = require('fs');
const path = require('path');
const { parseConfig } = require('./utils/confort.js');

const { Client } = require('discord.js');
const client = new Client();
const Slash = require('da-slash');
const slash = new Slash.Client(client, {
  commands: {
    directory: 'commands'
  }
});



fs.readdir('./config', { withFileTypes: true }, (err, files) => {
  files.filter(item => !item.isDirectory() && !item.name.includes('default'))
    .map(file => {
      const config = parseConfig(`./config/${file.name}`);
      const abbr = path.parse(file.name).name;


    });
});
