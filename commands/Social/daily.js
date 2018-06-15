const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 30,
			runIn: ['text'],
			permissionLevel: 0,
			description: 'Claim your daily points.'
		});

		this.DAY = 8.64e+7;
	}

	async run(msg) {
		const has = Boolean(await this.r.table('social').get(msg.author.id).run());
		if (!has) return msg.send('You haven\'t been registered in the social system yet. Use the **register** command first!');
		const social = await this.r.table('social').get(msg.author.id).run();
		if (Date.now() - social.dailyTime < this.DAY) throw 'You can collect dailies only once a day.';
		social.points += 100;
		await this.r.table('social').update(social).run();
		return msg.send('Succesfully collected your daily reward.');
	}

	async init() {
		// eslint-disable-next-line id-length
		this.r = this.client.providers.get('rethinkdb');
	}

};
