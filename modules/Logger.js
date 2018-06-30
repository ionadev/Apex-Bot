const { WebhookClient } = require('discord.js');
const config = require('../config');

class Logger {

	constructor({ token, id }) {
		this.hook = new WebhookClient(id, token);
	}

	async send(title, description) {
		return this.hook.send({
			embed: {
				title,
				description
			}
		});
	}

}

module.exports = new Logger(config.webhook);
