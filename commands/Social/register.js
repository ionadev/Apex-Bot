const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 30,
			runIn: ['text'],
			permissionLevel: 0,
			description: 'Registers you to the social system.'
		});
	}

	async run(msg) {
		const has = Boolean(await this.r.table('social').get(msg.author.id).run());
		if (has) throw 'You\'ve already registered!';
		await this.r.table('social').insert({
			points: 0,
			reputation: 0,
			level: 0,
			dailyTime: 0,
			id: msg.author.id
		}).run();
		const { prefix } = msg.guild.configs;
		return msg.sendMessage(`Added you to the social system! Use **${prefix}daily** to claim daily points.`);
	}

	async init() {
		// eslint-disable-next-line id-length
		this.r = this.client.providers.get('rethinkdb').db;
	}

};
