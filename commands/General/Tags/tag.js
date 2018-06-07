/* eslint-disable complexity */

const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
			cooldown: 5,
			description: 'Manages tags.',
			extendedHelp: 'Use this command to view, list, edit, add and remove tags.',
			usage: '<view|edit|list|add|remove> [name:str] [contents:str][...]',
			usageDelim: ' '
		});
	}

	async run(msg, [type, name, ...contents]) {
		if (name) name.toLowerCase();
		let tags = await this.provider.get('tags', msg.guild.id);
		if (!tags) {
			await this.provider.create('tags', msg.guild.id, { data: [] });
			tags = await this.provider.get('tags', msg.guild.id);
		}
		switch (type) {
			case 'add': {
				if (!await msg.hasAtLeastPermissionLevel(2)) throw 'You do not have permission to add tags.';
				if (!name || !contents.length) throw 'You need to provide the tag to edit and the edited content.';
				const tag = tags.data.find(tag => tag.name.toLowerCase() === name);
				if (tag) throw `A tag named **${name}** already exists!`;
				tags.data.push({
					author: msg.author.id,
					name,
					contents: contents.join(' ')
				});
				await this.provider.replace('tags', msg.guild.id, tags);
				return msg.send(`Successfully created a tag named **${name}**!`);
			}

			case 'view': {
				if (!name) throw 'You need to tell me what tag you want to view.';
				const tag = tags.data.find(t => t.name.toLowerCase() === name);
				if (!tag) throw `The tag **${name}** does not seem to exist.`;
				return msg.send(`Tag: **${name}**
Created by: __${this.client.users.get(tag.author).tag}__
Contents: ${util.codeBlock(tag.contents)}
        `);
			}
			case 'list': {
				return msg.send(`**${msg.guild.name}'s Tags** (Total ${tags.data.length})
${util.codeBlock(tags.data.map((tag, index) => `[${index + 1}] : ${tag.name}`).join('\n'))}`);
			}

			case 'remove': {
				if (!await msg.hasAtLeastPermissionLevel(3)) throw 'You do not have permission to delete tags.';
				if (!name) throw 'You need to tell me what tag you want to view.';
				const tag = tags.data.find(t => t.name.toLowerCase() === name);
				if (!tag) throw `The tag **${name}** does not seem to exist.`;
				const index = tags.data.indexOf(tag);
				tags.data.splice(index, 1);
				await this.provider.replace('tags', msg.guild.id, tags);
				return msg.send(`Poof! The tag **${name}** was deleted.`);
			}

			case 'edit': {
				if (!await msg.hasAtLeastPermissionLevel(3)) throw 'You do not have permission to edit tags.';
				if (!name || !contents.length) throw 'You need to provide the tag to edit and the edited content.';
				const tag = tags.data.find(t => t.name.toLowerCase() === name);
				if (!tag) throw `The tag **${name}** does not seem to exist.`;
				tag.contents = contents.join(' ');
				await this.provider.replace('tags', msg.guild.id, tags);
				return msg.send(`Edited content for tag **${name}** to **${contents.join(' ')}**`);
			}
		}


		return null;
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
