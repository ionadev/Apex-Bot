const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			description: 'Rates the nominated user!',
			extendedHelp: 'This command accepts mentions, user names and user IDs!',
			usage: '<user:username>'
		});
	}

	async run(msg, [author]) {
		return msg.sendMessage(`I rate ${author} **${Math.round(Math.random() * 100)}/100**!`);
	}

};
