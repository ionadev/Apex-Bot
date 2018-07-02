const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Show off your stamp of approval.',
			botPerms: ['ATTACH_FILES'],
			usage: '<user:username>',
			cooldown: 10
		});
	}

	async run(msg, [user]) {
		return msg.channel.sendFile(await this.client.idioticAPI.approved(user.displayAvatarURL({ format: 'png', size: 512 })), 'approved.png');
	}

};
