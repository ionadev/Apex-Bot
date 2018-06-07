const { Structures } = require('discord.js');
const Moderation = require('../Moderation');

module.exports = Structures.extend('Guild', Guild => {
	class ApexGuild extends Guild {

		constructor(...args) {
			super(...args);

			this.moderation = new Moderation(this);
		}

	}

	return ApexGuild;
});

