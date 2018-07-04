/* eslint-disable camelcase */

const { Task } = require('klasa');
const snek = require('snekfetch');
const config = require('../config');

module.exports = class extends Task {

	async run() {
		return Promise.all([this.updateDBL(), this.updateDBots(), this.updateBFD()]);
	}

	async updateDBL() {
		return snek
			.post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
			.set('Authorization', config.BOTLISTS.DBL)
			.send({ server_count: this.client.guilds.size })
			.then(() => this.client.emit('log', 'Posted stats to DBL.'))
			.catch(() => null);
	}

	async updateDBots() {
		return snek
			.post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`)
			.set('Authorization', config.BOTLISTS.DBOTS)
			.send({ server_count: this.client.guilds.size })
			.then(() => this.client.emit('log', 'Posted stats to Dbots.'))
			.catch(() => null);
	}

	async updateBFD() {
		return snek
			.post(`https://botsfordiscord.com/api/v1/bots/${this.client.user.id}`)
			.set('Authorization', config.BOTLISTS.BFD)
			.send({ server_count: this.client.guilds.size })
			.then(() => this.client.emit('log', 'Posted stats to Dbots.'))
			.catch(() => null);
	}

};
