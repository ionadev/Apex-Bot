const { Event } = require('klasa');
const config = require('../config');

module.exports = class extends Event {

	async run() {
		if (!(await this.r.dbList().run()).includes('apex')) await this.r.dbCreate('apex').run();
		setInterval(() => this.client.updateStats(), 1000 * 60);
		this.client.commands.get('conf').permissionLevel = 3;
		this.client.user.setActivity(`${config.PRODUCTION ? config.PRODUCTIONPREFIX : config.DEVPREFIX}help | ${this.client.guilds.size} servers`);
	}

	get r() {
		return this.client.providers.get('rethinkdb').db;
	}

};
