const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bal', 'points'],
			cooldown: 30,
			runIn: ['text'],
			permissionLevel: 0,
			description: 'Shows your current balance.'
		});
	}

	async run(msg) {
		const has = Boolean(await this.r.table('social').get(msg.author.id).run());
		if (!has) return msg.send('You haven\'t been registered in the social system yet. Use the **register** command first!');
		const social = await this.r.table('social').get(msg.author.id).run();
		return msg.sendMessage(`You have **${social.points}** points, making you level **${social.level}**!`);
	}

	async init() {
		// eslint-disable-next-line id-length
		this.r = this.client.providers.get('rethinkdb').db;
	}

};
