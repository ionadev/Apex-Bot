const { Event } = require('klasa');
const config = require('../config');
const r = require("rethinkdbdash");

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { enabled: true });
	}

	run() {
		this.client.commands.get('conf').permissionLevel = 3;
		if((await r.dbList().run()).includes("apex")) await r.dbCreate("apex").run()
		this.client.user.setActivity(`${config.PRODUCTION ? config.PRODUCTIONPREFIX : config.DEVPREFIX}help | ${this.client.guilds.size} servers`);
	}

};
