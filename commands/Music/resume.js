const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,
			cooldown: 2,
			description: 'Resumes the music player.',
			permissionLevel: 2
		});
	}

	async run(msg) {
		const { player } = msg.guild;
		if (!player.playing) throw 'Nothing is playing.';
		if (!player.player.paused) throw 'The player hasn\'t been paused...';
		player.player.pause(false);
		return msg.sendMessage('▶ Resumed');
	}

};
