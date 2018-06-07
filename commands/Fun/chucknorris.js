const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
      cooldown: 4,

			description: 'Sends a random Chuck Norris joke.',
      extendedHelp: 'Powered by https://api.chucknorris.io',
		});
	}

	async run(msg) {
		const { text } = await snekfetch.get('https://api.icndb.com/jokes/random');
		return msg.sendMessage(`📢 **Chuck Norris joke:** *${JSON.parse(text).value.joke}*`);
	}

};