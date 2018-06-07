const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 3,
			description: 'Sets the mod-log channel of the server.',
			extendedHelp: 'The mod log channel is used to log moderation actions. Moderation actions are carried out using commands listed in the "Moderation" category.',
			usage: '[modlog:channel]'
		});
	}

	async run(msg, [newModLog]) {
		// eslint-disable-next-line max-len
		if (!newModLog) return msg.sendMessage(msg.guild.configs.moderation.modlog ? `The mod-log channel of this guild is set to <#${msg.guild.configs.moderation.modlog}>` : 'There is no mod-log set in this guild.');
		await msg.guild.configs.update('moderation.modlog', newModLog, msg.guild);
		return msg.sendMessage(`Changed mod-log channel for ${msg.guild.name} to ${newModLog.toString()}`);
	}

};
