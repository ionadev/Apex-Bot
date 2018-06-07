const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Manages the custom response triggers.',
			usage: '<add|view|edit|remove|list> (word:word) (response:response)[...]',
			usageDelim: ' ',
			cooldown: 5,
			subcommands: true
		});

		this
			.createCustomResolver('word', (arg, possible, msg, [action]) => {
				if (action === 'list' || arg) return arg;
				throw 'This command expects a word.';
			})
			.createCustomResolver('response', (arg, possible, msg, [action]) => {
				if (!['add', 'edit'].includes(action) || arg) return arg;
				throw 'This command expects a response.';
			});
	}

	async add(msg, [word, ...response]) {
		if (!await msg.hasAtLeastPermissionLevel(3)) throw 'You do not have permission to add triggers.';
		response = response.join(' ');
		let triggers = await this.provider.get('triggers', msg.guild.id);
		if (!triggers) {
			await this.provider.create('triggers', msg.guild.id, { data: [] });
			triggers = await this.provider.get('triggers', msg.guild.id);
		}
		if (triggers.data.find(d => d.word.toLowerCase() === word.toLowerCase())) throw `A custom response named \`${word}\` already exists.`;
		triggers.data.push({
			word,
			response,
			author: msg.author.id
		});
		await this.provider.replace('triggers', msg.guild.id, triggers);
		return msg.send(`Succesfully created a custom response named \`${word}\``);
	}

	async list(msg) {
		const triggers = await this.provider.get('triggers', msg.guild.id);
		if (!triggers) throw 'There are no custom responses configured in this server.';
		return msg.send(`**${msg.guild.name}s** Triggers (Total ${triggers.data.length})
${util.codeBlock(triggers.data.map((u, i) => `[${i + 1}] ${u.word}`).join('\n'))}`);
	}

	async remove(msg, [word]) {
		if (!await msg.hasAtLeastPermissionLevel(3)) throw 'You do not have permission to delete triggers.';
		const triggers = await this.provider.get('triggers', msg.guild.id);
		if (!triggers) throw 'There aren\'t any triggers to delete one from!';
		const trigger = triggers.data.find(d => d.word.toLowerCase() === word.toLowerCase());
		if (!trigger) throw `A custom response named \`${word}\` does not exist.`;
		const index = triggers.data.indexOf(trigger);
		triggers.data.splice(index, 1);
		await this.provider.replace('triggers', msg.guild.id, triggers);
		this.client.monitors.get('trigger').cache.delete(`${msg.guild.id}-${word.toLowerCase()}`);
		return msg.send(`Succesfully removed the trigger \`${word}\``);
	}

	async view(msg, [word]) {
		const triggers = await this.provider.get('triggers', msg.guild.id);
		if (!triggers) throw 'There aren\'t any triggers to view one from!';
		const trigger = triggers.data.find(d => d.word.toLowerCase() === word.toLowerCase());
		if (!trigger) throw `A custom response named \`${word}\` does not exist.`;
		return msg.send([
			`Trigger: **${trigger.word}**`,
			`Created by: __${this.client.users.get(trigger.author).tag}__`,
			`Content: ${util.codeBlock(undefined, trigger.response)}`
		].join('\n'));
	}

	async edit(msg, [word, ...newResponse]) {
		newResponse = newResponse.join(this.usageDelim);
		const triggers = await this.provider.get('triggers', msg.guild.id);
		if (!triggers) throw 'There aren\'t any triggers to edit one from!';
		const trigger = triggers.data.find(d => d.word.toLowerCase() === word.toLowerCase());
		if (!trigger) throw `A custom response named \`${word}\` does not exist.`;
		if (newResponse.toLowerCase() === trigger.response.toLowerCase()) throw 'The response is already what you\'re trying to make it!';
		trigger.response = newResponse;
		await this.provider.update('triggers', msg.guild.id, triggers);
		this.client.monitors.get('trigger').cache.delete(`${msg.guild.id}-${word.toLowerCase()}`);
		return msg.send(`Succesfully updated the trigger \`${word}\``);
	}

	get provider() { return this.client.providers.get('rethinkdb'); }

};
