const { Command, TextPrompt, Usage, util: { codeBlock } } = require('klasa');

// other announcement letters
const OTHER_CHARS = 52;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			usage: '<announcement:str{2,52}>',
			description: 'Sends an announcement to the announcement channel.',
			extendedHelp: 'Flags usage:\n\n--nomention: Does not mention the announcement role.',
			requiredConfigs: ['channels.announcement'],
			permissionLevel: 2
		});

		this.customizeResponse('announcement', 'What would you like to announce?');

		this.answers = ['yes', 'y'];
	}

	async run(msg, [announcement]) {
		console.log(announcement);
		const flag = Boolean(msg.flags.nomention);

		if (!flag && !msg.guild.configs.roles.announcement) return msg.send(msg.language.get('COMMAND_ANNOUNCE_NOCHANNEL'));
		const { announcement: role } = msg.guild.configs.roles;
		const toMention = flag ? '' : `for ${msg.guild.roles.get(role)}`;


		const channel = msg.guild.channels.get(msg.guild.configs.channels.announcement);
		if (channel.postable === false) return msg.send(msg.language.get('COMMAND_ANNOUNCE_NOPOST', channel));

		const prompt = new TextPrompt(msg, new Usage(this.client, '<yes|y|no|n>'));
		const [answer] = await prompt.run(`Are you sure you would like to post the following announcement? ${codeBlock(undefined, announcement)}`);
		if (!this.answers.includes(answer)) return msg.send('Aborted');

		if (!flag) await msg.guild.roles.get(role).edit({ mentionable: true });
		await channel.send(`**New Announcement** ${toMention}\n\n${announcement}`);

		return msg.sendMessage(`There! Succesfully posted an announcement to ${channel}.`)
			.then(() => { if (!flag) msg.guild.roles.get(role).edit({ mentionable: false }); });
	}

};
