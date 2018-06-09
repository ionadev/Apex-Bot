const snek = require('snekfetch');
const config = require('../config');
const players = new Map();

class Player {

	constructor(client, manager, guild) {
		Object.defineProperty(this, 'client', { value: client });
		Object.defineProperty(this, 'guild', { value: guild });
		this.manager = manager;
		this.guild = guild;
		this.queue = [];
		this.repeat = false;
		this.autoplay = false;
		this.repeat = false;
		this.voteSkips = 0;
		this.maxSongLength = null;
		this.textChannelID = null;
		this.playingMessages = null;
		this.currentSong = null;
		players.set(guild.id, this);
	}

	async resolve(query, cb) {
		if (!/^http|(sc|yt)search/.test(query)) query = `ytsearch:${query}`;
		const isSearch = /^(sc|yt)search/.test(query);
		const { body } = await snek.get(`http://localhost:${config.restnode.port}/loadtracks`)
			.query({ identifier: query })
			.set('Authorization', config.restnode.password);
		if (!body.length) throw 'No tracks found.';
		if (body.length === 1 || isSearch) {
			if (cb && isSearch) {
				return await cb(body.slice(0, 5).map(track => Object.assign(track.info, { track: track.track })));
			} else {
				return Object.assign(body[0].info, { track: body[0].track });
			}
		} else {
			return body.map(track => Object.assign(track.info, { track: track.track }));
		}
	}

	async add(song, cb) {
		if (this.queue.length > 200) return 'MAX_LEN';
		const item = await this.resolve(song, cb);
		if (typeof item === 'string') return item;
		else if (Array.isArray(item)) this.queue = this.queue.concat(item);
		else this.queue.push(item);
		return item;
	}

	async play(player) {
		let song = this.queue.shift();
		if (!song.track) {
			song = await this.resolve(song.uri);
		}
		const channel = this.client.channels.get(this.textChannelID);
		channel.send(`Now playing: **${song.title}**, by ${song.author}!`);
		this.currentSong = song;
		player.play(song.track);
		player.once('end', () => {
			this.currentSong = null;
			this.play(player);
		});
	}

	connect(voiceChannel) {
		return new Promise((res, rej) => {
			voiceChannel.join()
				.then(res)
				.catch(err => {
					if (String(err).includes('ECONNRESET')) throw 'There was an issue connecting to the voice channel, please try again.';
					this.client.emit('error', err);
					rej(err);
				});
		});
	}

	get voiceChannel() {
		return this.guild.me.voiceChannel;
	}

	get connection() {
		return (this.voiceChannel && this.voiceChannel.connection) || true;
	}

	get dispatcher() {
		return (this.connection && this.connection.dispatcher) || true;
	}

	get playing() {
		return !this.paused && !this.idling;
	}

	get idling() {
		return !this.queue.length && !this.dispatcher;
	}

	get paused() {
		return (this.dispatcher && this.dispatcher.paused) || null;
	}

	static getPlayer(id) {
		return players.get(id);
	}

}

module.exports = Player;
