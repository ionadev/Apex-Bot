const { Structures } = require('discord.js');
const Moderation = require('../Moderation');
const Player = require('../Player');

module.exports = Structures.extend('Guild', Guild => {
	class ApexGuild extends Guild {

		constructor(...args) {
			super(...args);

			this.moderation = new Moderation(this);
			this.player = new Player(this.client, this.client._player, this);
		}

	}

	return ApexGuild;
});

