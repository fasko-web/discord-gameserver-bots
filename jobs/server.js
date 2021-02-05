const GameDig = require('gamedig');

module.exports = (ip, port = false, game = 'garrysmod') => {
  const response = GameDig.query({
    type: game,
    host: ip,
    ...(port && { port : port.toString() }),
    ...(port && { givenPortOnly: true })
  }).then((state) => {
    return {
      state: 'on',
      connect: state.connect,
      players: state.players.length.toString(),
      maxPlayers: state.maxplayers.toString(),
      map: state.map
    }
  }).catch((error) => {
    return {
      state: 'off',
      connect: ((port) ? `${ip}:${port}`: ip),
      players: '0',
      maxPlayers: 'N/A',
      map: 'N/A'
    }
  });
  return Promise.resolve(response);
};
