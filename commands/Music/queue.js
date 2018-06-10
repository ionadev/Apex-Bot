const { Command } = require('klasa');
const Player = require('../../lib/Player');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,
			cooldown: 2,
			description: 'Displays the music queue.'
		});
	}

	async run(msg) {
		const player = Player.getPlayer(msg.guild.id);
		if (!player || !player.queue.length) throw 'There are no songs in the music queue.';
		const { queue } = player;
		const output = [];
		for (let i = 0; i < Math.min(queue.length, 10); i++) {
			output.push(`${i + 1}. ${queue[i].title} - Requested by: ${queue[i].requester.tag || 'Youtube Autoplay'}`);
		}
		return msg.channel.send([
			`🗒 __**${msg.guild.name}'s Music Queue:**__ Currently **${queue.length}** songs queued ${(queue.length > 10 ? '*[Only next 10 shown]*' : '')}`,
			`${'```'}${output.join('\n')}${'```'}`
		]);
	}

};
