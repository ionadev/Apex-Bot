const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const { get } = require('snekfetch');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Create a drake meme with two users.',
      requiredPermissions: ['ATTACH_FILES'],
      usage: '<user:username> <user:username>',
      usageDelim: ' ',
      cooldown: 10,
    })
    
    this.plate = null;
  }
  
  async run(msg, [user, _user]) {
    const [avi, _avi] = await Promise.all([
      get(user.displayAvatarURL({ format: 'png' })),
      get(_user.displayAvatarURL({ format: 'png' }))
    ])
    const canvas = new Canvas(500, 500)
		.addImage(this.plate.body, 0, 0, 500, 500)
		.addImage(avi.body, 250, 0, 250, 235)
    .restore()
		.addImage(_avi.body, 250, 235, 250, 260)
    .restore()
		.toBuffer();
    return msg.channel.sendFile(canvas, 'drake.png');
  }
  
  async init() {
    this.plate = await get('https://cdn.discordapp.com/attachments/440114292226785292/445424152224989195/drake.png');
  }
}