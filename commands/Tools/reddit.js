const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: msg => msg.language.get('COMMAND_SUBREDDIT_DESCRIPTION'),
			extendedHelp: msg => msg.language.get('COMMAND_SUBREDDIT_EXTENDED'),
			usage: '[random|hot|new|top] <subreddit:str>',
			cooldown: 10,
			usageDelim: ' '
		});
		this.types = ['random', 'hot', 'new', 'top'];
		this.customizeResponse('subreddit', msg => msg.language.get('CUSTOMPROMPT_SUBREDDIT'));
	}

	async run(msg, [type, subreddit]) {
		type = type || this.types[Math.floor(Math.random() * this.types.length)];

		const { body } = await snek.get(`https://www.reddit.com/r/${subreddit}/${type}.json`)
			.catch(() => msg.send(msg.language.get('COMMAND_SUBREDDIT_INVALID')));
		if (!body || !body.data) throw msg.language.get('COMMAND_SUBREDDIT_INVALID');
		let meme;

		if (type === 'random') {
			meme = body[0].data.children[Math.floor(Math.random() * body[0].data.children.length)].data
				.catch(() => msg.send(msg.language.get('COMMAND_SUBREDDIT_INVALID')));
		} else { meme = body.data.children[Math.floor(Math.random() * body.data.children.length)].data; }

		if (!msg.channel.nsfw && meme.over_18) {
			throw msg.language.get('COMMAND_SUBREDDIT_NONSFW');
		}
		return msg.send(msg.language.get('COMMAND_SUBREDDIT_OUTPUT', meme));
	}

};
