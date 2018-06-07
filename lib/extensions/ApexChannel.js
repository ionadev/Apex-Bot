const { Structures } = require('discord.js');
const Connect4 = require('../Connect4');
const TicTacToe = require('../TicTacToe');

module.exports = Structures.extend('TextChannel', Channel => {
	class ApexChannel extends Channel {

		constructor(...args) {
			super(...args);

			this.connect4 = new Connect4(this);
			this.tictactoe = new TicTacToe(this);
		}

	}

	return ApexChannel;
});
