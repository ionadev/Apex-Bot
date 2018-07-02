const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Trigger someone.',
			botPerms: ['ATTACH_FILES'],
			usage: '[user:username]',
			cooldown: 15
		});
	}

	async run(msg, [user = msg.author]) {
		return msg.channel.send(new MessageAttachment(await this.client.idioticAPI.triggered(user.displayAvatarURL({ format: 'png', size: 512 })), 'triggered.gif'));
	}

};
