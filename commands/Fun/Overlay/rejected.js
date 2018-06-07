const { Command } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Add a rejected overlay to a user.',
      botPerms: ['ATTACH_FILES'],
      usage: '[user:username]',
      cooldown: 10,
    })
  }
  
  async run(msg, [user = msg.author]) {
    return msg.channel.sendFile(await this.client.idioticAPI.rejected(user.displayAvatarURL({ format: 'png', size: 512 })), 'rejected.png');
  }
}