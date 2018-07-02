const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['duckduckgo', 'ddg'],
			bucket: 2,
			cooldown: 5,
			permLevel: 0,

			description: 'Searches for a query on DuckDuckGo.',
			usage: '<query:str>'
		});
	}

	async run(msg, [query]) {
		const { body } = await snekfetch.get(`https://api.duckduckgo.com/?q=${query}&format=json`);
		const result = JSON.parse(body);
		const [topic] = result.RelatedTopics;
		    const embed = await new this.client.methods.Embed()
			.setColor(msg.member.roles.highest.color)
			.setURL(topic.FirstURL)
			.setThumbnail(result.Image ? result.Image : topic.Icon.URL)
			.setTitle(result.Heading)
			.setDescription(result.Abstract ? result.Abstract : topic.Text);
		return msg.send(`🔎I found the best result for your query, ${msg.author}!`, { embed: embed });
	}

};
