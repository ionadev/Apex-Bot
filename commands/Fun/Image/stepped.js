const { Command } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Displays a stepped picture of a user.',
      botPerms: ['ATTACH_FILES'],
      usage: '<user:username>',
      cooldown: 10,
    })
  }
  
  async run(msg, [user]) {
    return msg.channel.sendFile(await this.client.idioticAPI.stepped(user.displayAvatarURL({ format: 'png', size: 128 })), 'stepped.png');
  }
}