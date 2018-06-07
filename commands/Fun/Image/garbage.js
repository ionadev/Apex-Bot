const { Command } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Thrown out with the trash.',
      botPerms: ['ATTACH_FILES'],
      usage: '<user:username>',
      cooldown: 10,
    })
  }
  
  async run(msg, [user]) {
    return msg.channel.sendFile(await this.client.idioticAPI.garbage(user.displayAvatarURL({ format: 'png', size: 256 })), 'garbage.png');
  }
}