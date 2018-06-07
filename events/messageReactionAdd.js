/* eslint-disable consistent-return */

const { Event } = require('klasa');
const Starboard = require('../lib/StarboardManager');

module.exports = class extends Event {

	async run(messageReaction, user) {
		if (!messageReaction.message.guild || messageReaction.emoji.name !== '⭐') return;
		const { message: msg } = messageReaction;
		if (!msg.guild.configs.starboard.channel) return;
		if (msg.author === user) return msg.sendMessage(`${user}, you cannot star your own messages!`);
		const count = messageReaction.count;
		new Starboard(this.client).added(msg, count);
	}

};
