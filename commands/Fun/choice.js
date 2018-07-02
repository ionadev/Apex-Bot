const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['choose', 'decide'],

			description: 'Makes a decision for you given some choices.',
			usage: '<choices:str> [...]',
			usageDelim: ','
		});

		this
			.customizeResponse('choices', 'From what would you like me to choose from? Separate choices with a comma.');
	}

	async run(msg, [...choices]) {
		return msg.reply(choices.length === 1 ?
			'You only gave me one choice, dummy.' :
			`I think you should go with "${choices[Math.floor(Math.random() * choices.length)]}"`);
	}

};
