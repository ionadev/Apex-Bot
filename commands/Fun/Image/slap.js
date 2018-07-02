const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Slap the mentioned user.',
			botPerms: ['ATTACH_FILES'],
			usage: '<user:username>',
			cooldown: 10
		});
	}

	async run(msg, [user]) {
		return msg.channel.sendFile(await this.client.idioticAPI.batSlap(msg.author.displayAvatarURL({ size: 128, format: 'png' }), user.displayAvatarURL({ format: 'png', size: 256 })), 'slap.png');
	}

};
