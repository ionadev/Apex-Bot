const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,
			cooldown: 2,
			description: 'Displays the music queue.',
			extendedHelp: 'Flags: --force'
		});
	}

	async run(msg) {
		return msg.guild.player.skip(msg);
	}

};
