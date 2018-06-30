const { Event } = require('klasa');
const util = require('../util/utils');

module.exports = class extends Event {

	async run(old, message) {
		if (this.client.ready && old.content !== message.content) this.client.monitors.run(message);
		if (old.content === message.content || !message.guild.configs.logs.messageEdits || !message.guild.configs.logs.channel) return;
		const channel = message.guild.channels.get(message.guild.configs.logs.channel);
		if (!channel.embedable) return;
		const diffArray = util.getDifference(old.content, message.content).split(' ');

		let cooltent = message.content || 'None';
		for (const word of diffArray) if (message.cleanContent) cooltent = cooltent.replace(word, `**${word}**`);
		return channel.send(`Message edited in ${message.channel.toString()}`, {
			embed: new this.client.methods.Embed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setColor(message.member.displayColor || null)
				.setImage(message.attachments.size ? message.attachments.first().url : null)
				.setDescription([
					'Old:',
					old.cleanContent || 'None',
					'New:',
					cooltent || 'None'
				].join('\n'))
		});
	}

};
