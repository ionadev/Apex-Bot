const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 2,
			runIn: ['text'],

			description: 'Send a message to a channel through the bot.',
			usage: '[channel:channel] <message:string> [...]',
			usageDelim: ' '
		});

		this
			.customizeResponse('message', 'What would you like to send?')
	}

	async run(msg, [channel = msg.channel, ...message]) {
		if (channel.postable === false && channel !== msg.channel) throw 'The selected channel is not postable.';
		return channel.send(message.join(' '));
	}

};