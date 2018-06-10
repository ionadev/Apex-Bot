const { Command } = require('klasa');
const Player = require('../../lib/Player');

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
		let player = Player.getPlayer(msg.guild.id);
		if (!player) player = new Player(this.client, this.client._player, msg.guild)
		player.textChannelID = msg.channel.id
		if ('soundcloud' in msg.flags) query = `scsearch:${query}`;
		let item;
		if ('choose' in msg.flags) {
			item = await player.add(query, async songs => {
				prompt(this, songs
					.map(({ author, title }, i) => `${i + 1}). ${title} \`${author}\``)
					.join('\n'));
			});
		} else {
			item = await player.add(query);
		}
		const musicPlayer = this.client._player.join({
			guild: msg.guild.id,
			channel: msg.member.voiceChannelID,
			host: this.client._player.nodes.first().host
		});
		if (!musicPlayer.playing) player.play(musicPlayer);
		if (Array.isArray(item)) return msg.send(`Queued a total **${item.length} songs.`);
		return msg.send(`Added **${item.title}** to the queue.`);
	}

};

function prompt() {
	// noop
}
