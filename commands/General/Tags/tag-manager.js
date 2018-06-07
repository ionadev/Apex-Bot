const { Command, TextPrompt, Usage } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tagsmanager', 'tags-manager', 'tagmanager'],
			bucket: 2,

			cooldown: 5,
			description: 'A wizard for easy tag crration.',
			extendedHelp: 'This command will prompt you through making a tag, or a custom command.',
			permissionLevel: 2
		});

		this.prompter1 = null;
		this.prompter2 = null;
	}

	async run(msg) {
		const prompter1 = new TextPrompt(msg, new Usage(this.client, '<tag:str{2,15}>'));
		const prompter2 = new TextPrompt(msg, new Usage(this.client, '<contents:str>'));

		const [tag] = await prompter1.run('What name should the tag have?');
		const [contents] = await prompter2.run(`What contents should the tag **${tag}** display?`);
		let tags = await this.provider.get('tags', msg.guild.id);
		if (!tags) {
			await this.provider.create('tags', msg.guild.id, { data: [] });
			tags = await this.provider.get('tags', msg.guild.id);
		}
		tags.data.push({
			name: tag,
			contents,
			author: msg.author.id
		});

		await this.provider.replace('tags', msg.guild.id, tags);
		return msg.send(`Succesfully created a tag with name \`${tag}\``);
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
