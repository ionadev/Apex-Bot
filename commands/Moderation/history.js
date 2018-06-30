const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 1,

			cooldown: 5,
			permissionLevel: 2,
			description: 'Shows you the history of a user.',
			extendedHelp: 'This command shows the number of moderation actions carried out on a person.',
			usage: '<user:user>'
		});

		this
			.customizeResponse('user', 'Whose history would you like to check?');
	}

	async run(msg, [user]) {
		if (!user) throw 'That user isn\'t even in this server lmao.';
		const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data.logs || []);
		const userlogs = modlogs.filter(log => log.user.id === user.id);
		if (!userlogs.length) throw `There is no log under the ${user.tag}(${user.id}) account.`;
		const actions = {
			ban: 0,
			unban: 0,
			softban: 0,
			kick: 0,
			warn: 0,
			mute: 0
		};
		for (const log of userlogs) {
			actions[log.type]++;
		}

		return msg.send([`The history under account ${user.tag} (${user.id}) is `,
			util.codeBlock('http', Object.entries(actions).map(([action, value]) => `${util.toTitleCase(`${action}s`).padEnd(9)}: ${value}`).join('\n'))
		]);
	}

	get provider() {
		return this.client.providers.default.db;
	}

};
