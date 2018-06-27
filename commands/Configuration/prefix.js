const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 15,
			permissionLevel: 3,
			bucket: 2,
			description: 'Updates the prefix of Apex.',
			usage: '[prefix:str{1,7}]',
			extendedHelp: 'This command helps you update the prefix of the bot. If no arguments are used, shows you the current prefix.'
		});
	}

	async run(msg, [newPrefix]) {
		if (!newPrefix) return msg.sendMessage(`The prefix of this guild is set to \`${msg.guildConfigs.prefix}\``);
		await msg.guild.configs.update('prefix', newPrefix, msg.guild);
		return msg.sendMessage(`Changed Command Prefix for ${msg.guild.name} to ${newPrefix}`);
	}

};
