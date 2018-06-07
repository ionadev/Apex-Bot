/* StarboardManager for managing starboards, used in the messageReaction events */

const path = require('path');

class StarboardManager {

	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });
		// message cache to store/fetch/delete prompt msgs
	}

	async added(msg, count) {
		if (!msg.guildConfigs.starboard.channel || count <= msg.guildConfigs.starboard.minimumstars ||
        msg.guildConfigs.starboard.ignoredChannels.includes(msg.channel.id)) return;
		const channel = msg.guild.channels.get(msg.guildConfigs.starboard.channel);
		if (!channel.embedable) return;
		const image = this.constructor.findAttachment(msg);
		const star = this.constructor.getStars(count);
		const embed = new this.client.methods.Embed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription(msg.content ? msg.cleanContent : 'None')
			.setFooter(msg.id)
			.setColor(0xEBA53D)
			.setImage(image)
			.setTimestamp();
		if (count === 1) {
			channel.send(`${star} ${count} <#${msg.channel.id}>`, { embed });
			return;
		}
		const messages = await channel.messages.fetch({ limit: 100 });
		const message = messages.find(mesg => mesg.author.id === this.client.user.id &&
            mesg.embeds.length > 0 &&
            mesg.embeds[0].footer &&
            mesg.embeds[0].footer.text.includes(msg.id)
		);
		/* eslint-disable-next-line consistent-return*/
		if (!message) return channel.send({ embed });
		await message.edit(`${star} ${count} <#${msg.channel.id}>`, { embed });
		return;
	}

	async removed(msg, count) {
		if (!msg.guildConfigs.starboard.channel ||
            msg.guildConfigs.starboard.ignoredChannels.includes(msg.channel.id)) return;
		const channel = msg.guild.channels.get(msg.guildConfigs.starboard.channel);
		switch (count === 0) {
			case true: {
				const messages = await channel.messages.fetch({ limit: 100 });
				const message = messages.find(mesg => mesg.author.id === this.client.user.id &&
                    mesg.embeds.length > 0 &&
                    mesg.embeds[0].footer &&
                    mesg.embeds[0].footer.text.includes(msg.id)
				);
				if (message) await message.delete();
				break;
			}

			default: {
				const image = this.constructor.findAttachment(msg);
				const star = this.constructor.getStars(count);
				const embed = new this.client.methods.Embed()
					.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
					.setDescription(msg.content ? msg.cleanContent : 'None')
					.setFooter(msg.id)
					.setColor(0xEBA53D)
					.setImage(image)
					.setTimestamp();
				const messages = await channel.messages.fetch({ limit: 100 });
				const message = messages.find(mesg => mesg.author.id === this.client.user.id &&
            mesg.embeds.length > 0 &&
            mesg.embeds[0].footer &&
            mesg.embeds[0].footer.text.includes(msg.id)
				);
				/* eslint-disable-next-line consistent-return*/
				if (!message) return channel.send({ embed });
				await message.edit(`${star} ${count} <#${msg.channel.id}>`, { embed });
				return;
			}
		}
	}

	// returns the attachment of a message
	static findAttachment(message) {
		let attachmentImage;
		const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
		const linkRegex = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_.]+)+\.(?:png|jpg|jpeg|gif|webp)/;

		if (message.attachments.some(attachment => extensions.includes(path.extname(attachment.url)))) {
			attachmentImage = message.attachments.first().url;
		}

		if (!attachmentImage) {
			const linkMatch = message.content.match(linkRegex);
			if (linkMatch && extensions.includes(path.extname(linkMatch[0]))) {
				[attachmentImage] = linkMatch;
			}
		}

		return attachmentImage;
	}

	static getStars(count) {
		if (count < 5) return '⭐';
		else if (count < 10) return '🌟';
		else if (count < 20) return '💫';
		else if (count < 30) return '🎇';
		else if (count < 50) return '🎆';
		return null;
	}

}

module.exports = StarboardManager;
