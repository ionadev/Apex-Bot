const { Command } = require('klasa');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 2,
			cooldown: 5,
			promptLimit: 0,
			permissionLevel: 0,
			description: 'Adds a song or plays the music queue.',
			usage: '<query:string>'
		});
	}

	async run(msg, [query]) {
		const { player } = msg.guild;
		player.textChannelID = msg.channel.id;
		if ('soundcloud' in msg.flags) query = `scsearch:${query}`;
		let item;
		if ('choose' in msg.flags) {
			item = await player.add(msg.author, query, async songs => {
				prompt(this, songs
					.map(({ author, title }, i) => `${i + 1}). ${title} \`${author}\``)
					.join('\n'));
			});
		} else {
			item = await player.add(msg.author, query);
		}
		if (Array.isArray(item)) await msg.send(`Added **${item.length} songs to the queue`);
		else await msg.send(`Added **${item.title}** to the queue.`);
		const musicPlayer = await this.client._player.join({
			guild: msg.guild.id,
			channel: msg.member.voiceChannelID,
			host: this.client._player.nodes.first().host
		});
		if (!musicPlayer.playing) player.play(musicPlayer);
	}

};

function prompt() {
	// noop
}
