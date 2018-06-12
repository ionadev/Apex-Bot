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
			usage: '[query:string]'
		});
	}

	async run(msg, [query]) {
		const { player } = msg.guild;
		if (!query) {
			if (!player.player.playing) return msg.send('The dispatcher is already playing a track.');
			if (!player.player.paused) return this.client.commands.get('resume').run(msg);
			return null;
		}
		player.textChannelID = msg.channel.id;
		if ('soundcloud' in msg.flags) query = `scsearch:${query}`;
		let item;
		if ('choose' in msg.flags) {
			item = await player.add(msg.author, query, true);
			if (item.length === 1) {
				await msg.channel.send(`Found only one selection: **${item[0].title}**`);
				[item] = item;
			} else {
				item = await prompt(item, msg);
			}
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
		return null;
	}

};

async function prompt(songs, msg) {
	songs = songs.slice(0, 5);
	await msg.channel.send([`🎵 **Top 5 searches**, choose a selection:\n`,
		`${songs.map((song, i) => `${i + 1}. [${song.title}](${song.uri}) by ${song.author} - ${Player.showSeconds(song.length)}`)}`
	].join('\n'));
	const messages = await msg.channel.awaitMessages(message => message.author === msg.author && parseInt(message.content));
	if (!messages || !messages.size) throw 'No selection chosen: aborting prompt.';
	const selection = messages.first().content;
	const vid = parseInt(selection);
	if (vid < 1 || vid > 5) throw 'Invalid option: expected a number between 1 and 5.';
	return songs[vid - 1];
}

