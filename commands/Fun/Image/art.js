const { Command } = require ('klasa');
module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Paint a pretty little picture.',
      botPerms: ['ATTACH_FILES'],
      usage: '[user:username]',
      cooldown: 10,
    })
  }
  
  async run(msg, [user = msg.author]) {
    return msg.channel.sendFile(await this.client.idioticAPI.bobRoss(user.displayAvatarURL({ format: 'png', size: 512 })), 'bobross.png');
  }
}