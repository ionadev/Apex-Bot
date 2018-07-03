const config = require('../../config');
const snek = require('snekfetch');

class Player {

	constructor(client, guild) {
		Object.defineProperty(this, 'client', { value: guild });
		this.guild = guild;
		this.queue = [];
		this.repeat = false;
	}

	async connect(channel) {
		return this.client.lavalink.join({
			guild: this.guild.id,
			channel: channel.id,
			host: 'localhost'
		});
	}

	async resolve(query, array) {
		const req = await snek.get(`http://${config.restnode.host}:${config.restnode.port}/loadtracks`)
			.query({ identifier: query })
			.set('Authorization', config.restnode.password);
		if (!req.body.length) throw 'No tracks found.';
		if (req.body.length === 1 && array) {
			return Object.assign(req.body[0].info, { track: req.body[0].track });
		} else {
			return req.body.map(track => Object.assign(track.info, { track: track.track }));
		}
	}

	async add(msg, query, array) {
		if (this.queue.length === 1000) throw 'Maximum songs enqueued.';
		query = await this.resolve(query, array);
		if (Array.isArray(query)) this.queue = this.queue.concat(song => Object.assign(song, { requester: msg.author }));
		else this.queue.push(Object.assign(query, { requester: msg.author }));
		return query;
	}

	get currentSong() {
		return this.queue[0];
	}

	get connection() {
		return this.client.lavalink.get(this.guild.id);
	}

}
