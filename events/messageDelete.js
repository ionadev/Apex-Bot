const { Event } = require('klasa');

module.exports = class extends Event {

	run(message) {
		if (message.author === this.client.user) return;
		if (!message.guild) return;
		const { logs } = message.guildConfigs;
		if (!logs.channel || !logs.messageDeletes) return;

		const channel = message.guild.channels.get(logs.channel);
		if (!channel.embedable) return;

		channel.send(`Message deleted in <#${message.channel.id}>`, {
			embed: new this.client.methods.Embed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(message.cleanContent)
				.setTimestamp()
				.setFooter(message.id)
				.setImage(message.attachments.size ? message.attachments.first().url : null)
		});

		if (message.command && message.command.deletable && message.responses) {
			if (Array.isArray(message.responses)) for (const msg of message.responses) msg.delete();
			else message.responses.delete();
		}
	}


};
