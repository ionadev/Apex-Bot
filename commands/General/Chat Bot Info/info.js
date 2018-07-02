const { Command } = require('klasa');
const package = require('../../../package.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(msg) {
		return msg.send([
			`<:apex:417996870045138944> **Apex v${package.version}** is a multipurpose discord bot with 24/7 uptime, a wide range of commands, performance and other features.`,
			'Apex is built using the framework Klasa, built upon Discord.js.',
			'',
			'**Core Commands**:',
			`• ${msg.guildConfigs.prefix}help will send you a list of commands. Mentioning Apex will send you the server's prefix.`,
			'• Commands are separated into categories such as Music, Moderation, Fun.',
			'• Using the conf command will help you configure Apex\'s settings.',
			'',
			'If you have any issues or want to report bugs: Join the support server at https://discord.gg/Kcez3AZ',
			'To invite the bot in your server, use the **invite** command.',
			'Apex has been developed by Stitch#1836.'
		].join('\n'));
	}

};
