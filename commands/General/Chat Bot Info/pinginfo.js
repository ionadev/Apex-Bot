const { HighChartsConstructor } = require('chart-constructor');

const { Command } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Shows a graph based off average client ping.',
      requiredPermissions: ['ATTACH_FILES']
    })
  }

    async run(msg) {
      const make = new HighChartsConstructor();
make.seriesSetter([
    {
        type: 'line',
        color: '#3498DB',
        data: [17, 15, 13, 18, 12],
        name: 'Bot'
    }
]);
make.titleOptions({ text: 'Chart' });
      console.log(await make.toBuffer())
      return msg.channel.sendFile(await make.toBuffer())
    }
}