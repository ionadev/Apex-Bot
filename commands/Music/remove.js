const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,
			cooldown: 2,
			description: 'Removes a song from the music queue.',
			usage: '<song:integer>'
		});
	}

	async run(msg, [song]) {
		if (song <= 1) throw 'Song number has to be greater than 1.';
		song--;

		const { player } = msg.guild;
		if (player.queue.length < song) throw `There are only ${player.queue.length} songs in the queue.`;
		const track = player.queue[song];
		if (track.requester !== msg.author) {
			if (!await msg.hasAtLeastPermissionLevel(2)) throw 'You can\'t remove a song somebody else requested! Try asking a DJ...';
		}

		player.queue.splice(song, 1);
		return msg.sendMessage(`🗑 Removed the song **${track.title}** requested by **${track.requester}**.`);
	}

};
