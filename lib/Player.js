const snek = require('snekfetch');
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

class Player {

	constructor(client, manager, guild) {
		Object.defineProperty(this, 'client', { value: client });
		Object.defineProperty(this, 'guild', { value: guild });
		this.manager = manager;
		this.queue = [];
		this.repeat = false;
		this.voteSkips = 0;
		this.skips = new Set();
		this.maxSongLength = null;
		this.textChannelID = null;
		this.playingMessages = null;
		this.currentSong = null;
		this.player = null;
	}

	/**
	 * Resolves a string query into a song/array
	 * @param {string} query The song to query
	 * @param {array} array Whether the func should return an array
	 * @returns {Array<song>|song}
	 */
	async resolve(query, array) {
		if (!/^http|(sc|yt)search/.test(query)) query = `ytsearch:${query}`;
		const isSearch = /^(sc|yt)search/.test(query);
		const { body } = await snek.get(`http://localhost:5201/loadtracks`)
			.query({ identifier: query })
			.set('Authorization', 'owo_a_lavalink_server');
		if (!body.length) throw 'No tracks found.';
		if (body.length === 1 || isSearch) {
			if (array && isSearch) {
				return body.map(track => Object.assign(track.info, { track: track.track }));
			} else {
				return Object.assign(body[0].info, { track: body[0].track });
			}
		} else {
			return body.map(track => Object.assign(track.info, { track: track.track }));
		}
	}

	/**
	 * Adds a song to the music queue
	 * @param {Klasauser} user The requester
	 * @param {song} song The song to add
	 * @param {array} array Whether the function should return an array
	 * @returns {song}
	 */
	async add(user, song, array) {
		if (this.queue.length > 200) return 'MAX_LEN';
		const item = await this.resolve(song, array);
		if (typeof item === 'string') {
			return item;
		} else if (Array.isArray(item)) {
			for (const track of item) {
				track.requester = user;
			}
			this.queue = this.queue.concat(item);
		} else {
			this.queue.push(Object.assign({ requester: user }, item));
		}
		return item;
	}

	/**
	 * Plays the first track in the music queue
	 * @param {player} player The music player
	 * @returns {void}
	 */
	async play(player) {
		if (!this.player) this.player = player;
		let song = this.queue.shift();
		if (!song.track) {
			song = await this.resolve(song.uri);
		}
		this.textChannel.send(`Now playing: **${song.title}**, by ${song.author}, as requested by ${song.requester}!`);
		this.currentSong = song;
		return this.player.play(song.track)
			.then(musicInterface => {
				musicInterface.once('end', async data => {
					if (data.reason === 'REPLACED') return;
					setTimeout(async () => {
						if (!this.queue.songs.length) {
							await this.client._player.leave(this.guild.id);
							return this.textChannel.send('No songs left in the music queue!');
						} else {
							if (this.repeat) this.queue.push(this.currentSong);
							this.currentSong = null;
							this.voteSkips = 0;
							this.skips = new Set();

							return this.play();
						}
					}, 500);
				})
					.once('error', err => {
						this.client.emit('error', err);
					});
			});
	}

	/**
	 * Checks if a member has permissions to use a command
	 * @param {KlasaMessage} msg The message object to resolve
	 * @returns {boolean}
	 */
	async permissionResolve(msg) {
		if (msg.author === this.dj) return true;
		else if (await msg.hasAtLeastPermissionLevel(2) && msg.flags.force) return true;
		return false;
	}

	/**
	 * Skips the queue, resolving skips
	 * @param {KlasaMessage} msg The message object
	 * @returns {void}
	 */
	async skip(msg) {
		if (!this.player || !this.currentSong) return msg.send('The music player isn\'t playing right now!');
		if (!this.isListening(msg.member)) return msg.send('You aren\'t even listening!');
		if (this.skips.has(msg.author.id)) return msg.send('You\'ve already voted to skip once!');
		if (msg.guild.me.voiceChannel.members.size <= 3) {
			return this._skip();
		}
		this.skips.add(msg.author.id);
		this.voteSkips++;
		const threshold = Math.ceil(this.voiceChannel.members
			.filter(member => !member.user.bot && !member.deaf)
			.length / 2);
		await this.textChannel.send(`Skips: ${this.voteSkips}/${threshold}.`);
		if (this.voteSkips === threshold) return this._skip();
		return null;
	}

	_skip() {
		this.textChannel.send(`Skipping **${this.currentSong.title}**...`);
		this.currentSong = null;
		this.voteSkips = 0;
		this.skips = new Set();
		return this.play(this.player);
	}

	getThumbnail() {
		const { identifier, uri } = this.currentSong;
		if (/^(https?:\/\/)?www\.youtube\.com\//.test(uri)) {
			return `https://img.youtube.com/vi/${identifier}/mqdefault.jpg`;
		} else if (/^(https?:\/\/)?twitch\.tv\//.test(uri)) {
			return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${identifier}-320x180.jpg`;
		} else {
			return undefined;
		}
	}

	showQueue(page = 1) {
		const embed = new this.client.methods.Embed()
			.setAuthor(`${this.guild.name}'s music queue`, this.guild.iconURL());
		return this.queue.length ?
			embed.setDescription([
				`Now playing: [${this.currentSong.title}](${this.currentSong.uri})\n\nUp next:\n${this.queue.slice((page - 1) * 10, ((page - 1) * 10) + 10)
				// eslint-disable-next-line
					.map((song, index) => `${((page - 1) * 10) + index + 1}: [${song.title}](${song.uri}) (${this.currentSong.isStream ? 'LIVE' : this.constructor.showSeconds(song.length)})`).join('\n')})`
			])
				.setFooter(`Total songs in queue: ${this.queue.length} Total Playing Time: ${this.queue.reduce((prev, val) => this.constructor.showSeconds(val.length + prev), 0)}`) : embed.setFooter('No more songs in queue!');
	}

	destroy() {
		this.client._player.leave(this.guild.id);
		this.currentSong = null;
		this.queue = [];
		this.autoplay = false;
		this.repeat = false;
		this.player = null;
		this.maxSongLength = Infinity;
		this.voteSkips = 0;
		this.playingMessages = null;
		this.textChannelID = null;
		this.client._player.leave(this.guild.id);
	}

	isListening(member) {
		return !member.deaf && member.voiceChannel.id === this.voiceChannel.id;
	}

	get voiceChannel() {
		return this.guild.me.voiceChannel;
	}

	get textChannel() {
		return this.client.channels.get(this.textChannelID);
	}

	get dj() {
		return this.currentSong.requester;
	}

	static showSeconds(duration) {
		const seconds = Math.floor(duration / SECOND) % 60;
		if (duration < MINUTE) return seconds === 1 ? 'a second' : `${seconds} seconds`;

		const minutes = Math.floor(duration / MINUTE) % 60;
		let output = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		if (duration >= HOUR) {
			const hours = Math.floor(duration / HOUR);
			output = `${hours.toString().padStart(2, '0')}:${output}`;
		}

		return output;
	}

}

module.exports = Player;
