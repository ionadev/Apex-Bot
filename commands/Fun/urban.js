const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Searches the urban dictionary for the definition to a search term.',
			usage: '<searchTerm:str> [result:int]',
			usageDelim: ', ',
			cooldown: 10,
			botPerms: ['EMBED_LINKS'],
			aliases: ['ud']
		});

		this
			.customizeResponse('searchTerm', 'What would you like to search?');
	}

	splitText(str, length) {
		const x = str.substring(0, length).lastIndexOf(' ');
		const pos = x === -1 ? length : x;
		return str.substring(0, pos);
	}

	async run(msg, [search, resultNum = 0]) {
		const url = `http://api.urbandictionary.com/v0/define?term=${search}`;
		const body = await snek.get(url).then(data => JSON.parse(data.text));
		if (resultNum > 1) resultNum--;

		const result = body.list[resultNum];
		if (!result) throw msg.language.get('COMMAND_URBAN_MAX', body.list.length);
		const wdef = result.definition.length > 1000 ?
			`${this.splitText(result.definition, 1000)}...` :
			result.definition;
		const embed = new this.client.methods.Embed()
			.setTitle(result.word)
			.setDescription(`${wdef}\n\n\`👍\` ${result.thumbs_up}\n\`👎\` ${result.thumbs_down}`)
			.setURL(result.permalink)
			.setColor(16586)
			.setThumbnail('http://i.imgur.com/qNTzb3k.png')
			.setFooter(`By ${result.author}`)
			.addField('Example', `*${this.splitText(result.example, 1000)}...*`);

		return msg.sendEmbed(embed);
	}

};
