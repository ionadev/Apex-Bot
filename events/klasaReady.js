const { Event } = require.main.exports;
const { PlayerManager } = require('discord.js-lavalink');
const { LAVALINK: { nodes } } = require('../config');

module.exports = class extends Event {

	async run() {
		await this.client.schedule.create('sweeper', '*/10 * * * *');
		await this.client.schedule.create('backup', '0 0 * * sun');
		await this.client.schedule.create('botlists', '0 * * * *');
		this.client.lavalink = new PlayerManager(this.client, nodes, {
			user: this.client.user.id,
			shards: this.client.shard ? this.client.shard.count : 1
		});
	}

};
