const { Command } = require('klasa');
const { post } = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Adds a custom playlist.',
			extendedHelp: [
				'This command accepts searches of Youtube, Soundcloud, Vimeo or Mixlr, including YT and SC playlists.',
				'To get contents of a playlist, use -customplaylist show <number>, where number is the number of the playlist.',
				'To get a list of playlists: use -customplaylist list.',
				'',
				'To use your playlist in the play command, use the play command:',
				'-play --customplaylist=number, where number is the number of your song.',
				'',
				'This command is exclusive to premium users. To become a premium user, contact Stitch#9441.'
			].join('\n'),
			usage: '[show|list] <query:str|playlist:int{1,5}>'
		});
	}

	async run(msg, [showOrList, query]) {
		await this.checkPremium(msg);
		if (showOrList) {
			if (showOrList === 'show') {
				const playlists = await this.r.table('playlists').get(msg.author.id);
				if (!playlists || !playlists.data.length) throw 'You have no playlists saved.';
				const num = isNaN(query) ? 0 : parseInt(query) - 1;
				const playlist = playlists.data[num];
				if (!playlist) return msg.send('The provided playlist does not exist.');
				let output;
				const songs = playlist.map((song, index) => `${index + 1}; ${song.title} - ${song.author}`).join('\n');
				if (playlist.length > 20) {
					output = `Raw playlist content: ${await this.hastebin(songs)}`;
				} else {
					output = [
						`Playlist #${num + 1}`,
						'',
						songs
					];
				}
				return msg.send(output);
			} else {
				const playlists = await this.r.table('playlists').get(msg.author.id);
				if (!playlists || !playlists.data.length) throw 'You have no playlists saved.';
				const output = [];
				playlists.forEach((playlist, index) => {
					if (!playlist.length) return;
					const songs = playlist.map((song, index) => `${index + 1}; ${song.title} - ${song.author}`).join('\n');
					output.push(`Playlist #${index + 1}`);
					output.push(songs);
					output.push('');
				});
				const haste = await this.hastebin(output);
				return msg.send(`Raw playlist contents: ${haste}`);
			}
		}

		const userPlaylist = await 
	}

	async checkPremium(msg) {
		const premium = await this.r.table('premium').get(msg.author.id).run();
		if (!premium || premium.level < 2) throw 'You need to be premium level 2 to use this command.';
		return null;
	}

	async hastebin(data) {
		const { body } = await post('https://hastebin.com/documents').send(data);
		return `https://hastebin.com/${body.key}`;
	}

	get r() {
		return this.client.providers.default.db;
	}

};
