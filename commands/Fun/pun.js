const { Command } = require.main.exports;
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Generates a random pun.' });
	}

	async run(msg) {
		const { body } = await snek
			.get('https://icanhazdadjoke.com/')
			.set('Accept', 'application/json');

		// really, really rare edge case.
		return msg.sendMessage(body.joke.length ? `Random pun: **${body.joke}**` : 'Something went wrong. Try again later.');
	}

};
