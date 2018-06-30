const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['thumbs'],
			description: 'Gives a thumbs as another user.',
			botPerms: ['ATTACH_FILES'],
			usage: '[user:username]',
			cooldown: 10
		});
	}

	async run(msg, [user = msg.author]) {
		return msg.channel.sendFile(await this.client.idioticAPI.vaultBoy(user.displayAvatarURL({ format: 'png', size: 128 })), 'vault.png');
	}

};
