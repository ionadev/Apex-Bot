const { Monitor, util: { sleep } } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: true,
			ignoreOthers: false
		});

		this.cache = new Map();
	}

	async run(msg) {
		if (!msg.guild || !msg.channel.postable) return;
		if (this.cache.has(`${msg.guild.id}-${msg.content.toLowerCase()}`)) {
			await msg.send(this.cache.get(`${msg.guild.id}-${msg.content.toLowerCase()}`));
			await sleep(500);
			return;
		}

		const words = await this.provider.get('triggers', msg.guild.id).catch(() => null);
		if (!words) return;
		const trigger = words.data.find(c => c.word.toLowerCase() === msg.content.toLowerCase());
		if (trigger) {
			console.log(trigger);
			this.cache.set(`${msg.guild.id}-${msg.content.toLowerCase()}`, trigger.response);
			await msg.send(trigger.response);
			await sleep(500);
			return;
		}
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

	async init() {
		setInterval(() => this.cache.clear(), 300000);
	}

};
