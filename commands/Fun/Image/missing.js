const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays a missing poster of a user.',
			botPerms: ['ATTACH_FILES'],
			usage: '[user:username]',
			cooldown: 10
		});
	}

	async run(msg, [user = msg.author]) {
		return msg.channel.sendFile(await this.client.idioticAPI.missing(user.displayAvatarURL({ format: 'png', size: 256 }), user.username), 'missing.png');
	}

};
