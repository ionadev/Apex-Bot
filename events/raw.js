const { Event } = require('klasa');
const { Constants: { Events } } = require('discord.js');

module.exports = class extends Event {

	async run(data) {
		const event = Events[data.t];
		if (this.client.rawEvents.has(event)) {
			const rawEvent = this.client.rawEvents.get(event);
			if (rawEvent.enabled) rawEvent.run(data.d);
		}
	}


};
