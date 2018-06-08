const { Event } = require('klasa');
const config = require('../config');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { enabled: true });
	}

	run() {
		this.client.commands.get('conf').permissionLevel = 3;
		this.client.user.setActivity(`${config.PRODUCTION ? config.PRODUCTIONPREFIX : config.DEVPREFIX}help | ${this.client.guilds.size} servers`);
	}

};
