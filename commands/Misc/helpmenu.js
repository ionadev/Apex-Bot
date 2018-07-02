const { Command, RichMenu, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: false,
			description: msg => msg.language.get('COMMAND_HELPMENU_DESCRIPTION'),
			cooldown: 15
		});
		this.dbl = true;
	}

	async run(msg) {
		const color = msg.member.colorRole ? msg.member.colorRole.color : 'RANDOM';
		const album = new RichMenu(new this.client.methods.Embed()
			.setColor(color));
		for (const command of this.client.commands.filter(c => c.permLevel <= 6).values()) {
			album.addOption(command.name, util.isFunction(command.description) ? command.description(msg) : command.description);
		}
		album.setInfoPage(new this.client.methods.Embed()
			.setColor(color)
			.setDescription(msg.language.get('COMMAND_HELPMENU_INFOPAGE')));
		const collector = await album.run(await msg.send('loading...'), { filter: (reaction, user) => user === msg.author, time: 60000, prompt: 'Which page would you like to jump to?' });
		const option = await collector.selection;
		if (option === null) return collector.message.delete();
		const chosenCommand = this.client.commands.get(album.options[option].name);

		const cmd = chosenCommand;

		const embed = new this.client.methods.Embed()
			.setTitle(msg.language.get('COMMAND_HELPMENU_CHOSEN', cmd))
			.setColor(color)
			.addField('Description', util.isFunction(cmd.description) ? cmd.description(msg) : cmd.description)
			.addField('Usage', chosenCommand.usage.fullUsage(msg));
		return collector.message.edit(embed);
	}

};
