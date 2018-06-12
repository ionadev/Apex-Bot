const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,
			cooldown: 2,
			description: 'Displays the music queue.',
			usage: '[page:int]'
		});
	}

	async run(msg, [page = 1]) {
		const { player } = msg.guild;
		if (!player.currentSong) throw 'No songs playing!';
		else if (page > Math.ceil(player.queue.length / 15)) page = Math.ceil(player.queue.length / 15);

		return msg.sendEmbed(player.queue(page));
	}

};
