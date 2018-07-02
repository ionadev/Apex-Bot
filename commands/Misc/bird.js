const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
			botPerms: ['EMBED_LINKS'],
			cooldown: 5,
			description: 'Shows you a random bird.',
			extendedHelp: 'Powered by random.birb.pw.'
		});

		this.API_URL = 'http://random.birb.pw/tweet/';
	}

	async run(msg) {
		const { body } = await snek.get(this.API_URL);
		return msg.sendEmbed(new this.client.methods.Embed()
			.setAuthor('Random bird')
			.setImage(`https://random.birb.pw/img/${body}`)
			.setFooter('Powered by random.bird.pw')
		);
	}

};
