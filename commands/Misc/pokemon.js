const { Command, Stopwatch } = require('klasa');
const snek = require('snekfetch');
const HTMLParser = require('fast-html-parser');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'You have 15 seconds. Who\'s that Pokémon?',
			cooldown: 10,
			fun: true
		});
		this.sessions = new Set();
	}

	async run(msg) {
		const timer = new Stopwatch();
		if (this.sessions.has(msg.channel.id)) throw msg.language.get('COMMAND_POKEMON_STOPPED');
		this.sessions.add(msg.channel.id);

		const rand = Math.floor(Math.random() * 802);
		let poke = rand > 0 ? rand : Math.floor(Math.random() * 802);
		poke = poke.toString().padStart(3, '0');

		const res = await snek.get(`https://pokemondb.net/pokedex/${poke}`);
		const root = HTMLParser.parse(res.text);
		const titleRaw = root.querySelector('title');
		const pokeName = titleRaw.childNodes[0].rawText.split(' Pokédex:')[0];
		const img = `https://img.pokemondb.net/artwork/${pokeName.split(' ').join('-')}.jpg`;
		this.client.emit('log', `Pokémon took: ${timer.stop()}`);

		const embed = new this.client.methods.Embed()
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
			.setImage(img)
			.setFooter(msg.language.get('COMMAND_POKEMON_HELP'));

		const message = await msg.sendEmbed(embed);


		const answers = await msg.channel.awaitMessages(m => m.author.id === msg.author.id, { time: 15000, max: 1 });
		if (!answers || !answers.size) {
			this.sessions.delete(msg.channel.id);
			return msg.sendMessage(msg.language.get('COMMAND_POKEMON_TIMEOUT', pokeName));
		}
		const answer = answers.first().content.toLowerCase();

		if (answer === pokeName.toLowerCase()) {
			await message.delete();
			this.sessions.delete(msg.channel.id);
			return msg.channel.sendFile(img, `${pokeName}.png`, msg.language.get('COMMAND_POKEMON_CORRECT', pokeName));
		}
		await message.delete();
		this.sessions.delete(msg.channel.id);
		return msg.channel.sendFile(img, `${pokeName}.png`, msg.language.get('COMMAND_POKEMON_WRONG', pokeName));
	}

};
