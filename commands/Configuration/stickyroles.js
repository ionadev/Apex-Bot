const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 10,
			permissionLevel: 3,
			bucket: 2,
			description: 'Enables sticky roles.',
			usage: '[nobots]',
			extendedHelp: ['If sticky roles are enabled a person leaves and rejoins, Apex will give him his roles back.',
				'This makes those roles "stick". Disable sticky roles by using this command when they are enabled.'
			].join('\n');
		});
	}

	async run(msg, [nobots = false]) {
		if (!await this.r.table('stickyroles').get(msg.guild.id).run()) {
			await this.r.table('stickyroles').insert({
				enabled: true,
				bots: !nobots,
				members: [],
				id: msg.guild.id
			}).run();
			return msg.send('Enabled sticky roles in this server.');
		}

		const stickyroles = await this.r.table('stickyroles').get(msg.guild.id).run();
		const { enabled } = stickyroles;
		await this.r.table('stickyroles').update({ enabled: !enabled }).run();
		return msg.send(`${enabled ? 'Disabled' : 'Enabled'} sticky roles in this server.`);
	}

	async init() {
		if (!this.r) this.r = this.client.providers.default.db;
	}

};
