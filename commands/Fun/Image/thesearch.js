const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'The search continues...',
			botPerms: ['ATTACH_FILES'],
			usage: '<user:username> <text:str{2,21}>[...]',
			usageDelim: ' ',
			cooldown: 10
		});
	}

	async run(msg, [user, ...text]) {
		text = text.join(this.usageDelim);
		return msg.channel.sendFile(await this.client.idioticAPI.theSearch(user.displayAvatarURL({ format: 'png', size: 128 }), text), 'thesearch.png');
	}

};
