const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 10,
			runIn: ['text'],
			permissionLevel: 0,
			description: 'Displays the leaderboard.'
		});
	}

	async run(msg) {
		const users = await this.r.table('social').run();
		const balances = users.sort((a, b) => a.points - b.points).map(user => user);
		const top10 = balances.slice(0, 10);
		const embed = new this.client.methods.Embed()
			.setTitle(`${msg.guild}'s Leaderboard`, msg.guild.iconURL())
			.setColor(0xA0D7D1);
		for (const person of top10) {
			embed.addField(`${this.client.users.get(person.id).tag}: ${person.points} points.`,);
		}
	}

	async init() {
		// eslint-disable-next-line id-length
		this.r = this.client.providers.get('rethinkdb').db;
	}

};
