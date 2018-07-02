const { Command } = require('klasa');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'This... this is beautiful',
			botPerms: ['ATTACH_FILES'],
			usage: '[user:username]',
			cooldown: 10
		});
	}

	async run(msg, [user = msg.author]) {
		return msg.channel.sendFile(await this.client.idioticAPI.beautiful(user.displayAvatarURL({ format: 'png', size: 256 }), 'beautiful.png'));
	}

};
