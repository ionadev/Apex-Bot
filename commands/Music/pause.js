const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,
			cooldown: 2,
			description: 'Pauses the music player.',
			permissionLevel: 2
		});
	}

	async run(msg) {
		const { player } = msg.guild;
		if (!player.playing) throw 'Nothing is playing.';
		if (player.player.paused) throw 'The player is already paused. Maybe resume it?';
		player.player.pause(true);
		return msg.sendMessage('⏸ Paused');
	}

};
