const { Command, util } = require('klasa');
const { TextChannel } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 2,
			cooldown: 5,
			permissionLevel: 2,
			description: 'Configures a greeting for the server.',
			extendedHelp: [
				'The greeting command configures a greeting for the server.',
				'Choosing the text option will set the greeting to the text you wish. Choosing the channel option will set the greeting channel to the specified channel.',
				'Examples:',
				'To set the greeting to "Welcome to this server, {user}!", use a!greeting text Welcome to the server, {user}!',
				'To set the greeting channel to "#welcome", use a!greeting channel #welcome',
				'Using this command w/o arguments will show you the greeting channel and message for the server.',
				'',
				'Keys:',
				'{member}: Mention, {membername}: Username, {server}: Server name, {membertag}: Username + discriminator.'
			].join('\n'),
			usage: '<view|text|channel|reset> [channel:channel|greeting:str][...]',
			usageDelim: ' '
		});
	}

	async run(msg, [type, ...channelOrMessage]) {
		switch (type) {
			case 'view': {
				const response = ['There is no greeting channel set in this server.',
					'There is no greeting saved in this server.'
				];
				if (msg.guild.configs.welcomer.channel) response[0] = `The greeting channel is set to <#${msg.guildConfigs.welcomer.channel}>.`;
				if (msg.guildConfigs.welcomer.greeting) response[1] = `The greeting message is set to ${util.codeBlock(undefined, msg.guildConfigs.welcomer.greeting)}`;
				return msg.send(response.join(' '));
			}
			case 'text': {
				if (!channelOrMessage.length) throw 'You need to provide a valid greeting!';
				channelOrMessage = channelOrMessage.join(' ');
				const { errors, updated } = await msg.guild.configs.update('welcomer.greeting', channelOrMessage, msg.guild);
				if (errors.length) return msg.sendMessage(errors[0]);
				if (!updated.length) throw 'The greeting was already set to that value.';
				return msg.sendMessage(`Succesfully edited ${msg.guild.name}'s greeting to ${util.codeBlock(null, channelOrMessage)}.`)
			}
			case 'channel': {
				if (!channelOrMessage.length) throw 'You need to provide a valid channel!';
				channelOrMessage = channelOrMessage.join('\n');
				if (!channelOrMessage instanceof TextChannel) throw 'You have to provide an appropriate channel mention or ID.';
				await msg.guild.configs.update('welcomer.channel', channelOrMessage, msg.guild);
				return msg.send(`Succesfully set ${msg.guild.name}'s greeting channel to ${channelOrMessage.toString()}`);
			}
		}

		return null;
	}

};
