const { Command } = require('klasa');
const { convert: { toCodePoint } } = require('twemoji');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['emote'],
			bucket: 3,
			cooldown: 5,
			description: 'Shows you an emote.',
			extendedHelp: 'This command shows an image of a custom server emote.',
			usage: '<emote:customemote>'
		});

		this
			.createCustomResolver('customemote', (arg, possible, msg) => {
				const match = arg.match(/<:([a-z0-9-_]{2,32}):(\d{17,21})>/i);
				if (match) {
					return `https://cdn.discordapp.com/emojis/${match[2]}.png`;
				} else {
					const codepoint = toCodePoint(arg);
					return `https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/${codepoint}.png`
				}
			});
	}

	async run(msg, [emote]) {
		const { body } = await snek.get(emote);
		return msg.channel.sendFile(body);
	}

};
