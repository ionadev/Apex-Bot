const { Command } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Create a wanted poster of a user.',
      requiredPermissions: ['ATTACH_FILES'],
      usage: '[user:username]',
      cooldown: 10,
    })
  }
  
  async run(msg, [user = msg.author]) {
    return msg.channel.sendFile(await this.client.idioticAPI.wanted(user.displayAvatarURL({ format: 'png', size: 512 })), 'wanted.png');
  }
}