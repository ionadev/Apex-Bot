const { Command } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Feel like banging your head on a brick wall?',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10,
    })
  }
  
  async run(msg) {
    return msg.channel.sendFile(await this.client.idioticAPI.facepalm(msg.author.displayAvatarURL({ format: 'png', size: 256 })), 'facepalm.png');
  }
}