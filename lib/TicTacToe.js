/*
Apex's tic tac toe class, for OOP reaction
based tic tac toe games
*/

const { util } = require('klasa');

class TicTacToe {

	/**
  * Initializes this class
  * @param {TextChannel} channel The channel the game is being played in.
  */
	constructor(channel) {
		Object.defineProperty(this, 'channel', { value: channel });

		/**
    * Whether a tic tac toe game is being played in this channel
    * @since 1.0.1
    */
		this.playing = false;

		/**
    * The emojis this class uses
    * @since 1.0.1
    */
		this._emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣',
			'7⃣', '8⃣', '9⃣'];

		/**
    * A cached array of the members playing this game
    * @since 1.0.1
    */
		this.members = [];

		/**
    * The member whose turn it is
    * @since 1.0.1
    */
		this.turn = null;

		/**
    * A cached game table
    * @since 1.0.1
    */
		this.table = [
			['1', '2', '3'],
			['4', '5', '6'],
			['7', '8', '9']
		];
	}

	/**
  * Initializes and starts a game
  * @param {KlasaMessage} message A message object
  * @param {KlasaUser} user The challenged user
  * @returns {Promise<KlasaMessage>}
  * @since 1.0.1
  */
	async start(message, user) {
		this.playing = true;
		this.turn = 0;
		this.members.push(message.author, user);

		const msg = await this.channel.send('Loading...');
		for (const emoji of this._emojis) await msg.react(emoji);
		await msg.edit(`It is now ${this.currentMember.username}'s turn\n${this.displayTable}`);
		return msg;
	}

	/**
  * Returns the position of the number on the tic tac toe board
  * @param {number} number The number to verify
  * @returns {Object<number>} xy An object of x, y coordinates
  * @since 1.0.1
  */
	getPosition(number) {
		let x, y;
		switch (number) {
			case 1: x = 0; y = 0; break;
			case 2: x = 0; y = 1; break;
			case 3: x = 0; y = 2; break;
			case 4: x = 1; y = 0; break;
			case 5: x = 1; y = 1; break;
			case 6: x = 1; y = 2; break;
			case 7: x = 2; y = 0; break;
			case 8: x = 2; y = 1; break;
			case 9: x = 2; y = 2; break;
      // no default
		}
		return { x, y };
	}

	/**
  * Checks if the chosen number is available
  * @param {number} number The number to verify
  * @returns {boolean}
  * @since 1.0.1
  */
	checkTable(number) {
		const { x, y } = this.getPosition(number);
		return ['X', 'O'].includes(this.table[x][y]);
	}

	/**
  * Checks for a win
  * @returns {boolean}
  * @since 1.0.1
  */
	checkForWin() {
		// vertical check
		for (let i = 0; i < 3; i++) {
			if (this.table[0][i] === this.symbol && this.table[1][i] === this.symbol && this.table[2][i] === this.symbol) return true;
		}

		// horizontal check
		for (let i = 0; i < 3; i++) {
			if (this.table[i][0] === this.symbol && this.table[i][1] === this.symbol && this.table[i][2] === this.symbol) return true;
		}

		// diagonal check
		const { table } = this;
		const ox = this.symbol;

		if (table[0][0] === ox && table[1][1] === ox && table[2][2] === ox) return true;
		if (table[2][0] === ox && table[1][1] === ox && table[0][2] === ox) return true;

		return false;
	}

	/**
  * Checks for a draw
  * @returns {boolean}
  * @since 1.0.1
  */
	checkDraw() {
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				if (!['X', 'O'].includes(this.table[x][y])) return false;
			}
		}
		return true;
	}

	/**
  * Resets the game instance
  * @returns {Promise<void>}
  * @since 1.0.1
  */
	reset() {
		this.playing = false;
		this.turn = null;
		this.members = [];
		this.table = [
			['1', '2', '3'],
			['4', '5', '6'],
			['7', '8', '9']
		];

		return true;
	}

	/**
  * Updates the table
  * @param {number} number The number to update
  * @returns {boolean}
  * @since 1.0.1
  */
	updateTable(number) {
		const { x, y } = this.getPosition(number);
		this.table[x][y] = this.symbol;
		return true;
	}

	/**
  * Gets a number from an emoji
  * @param {string} emoji The emoji to numerify
  * @returns {number} The number this emoji represents
  * @since 1.0.1
  */
	getNumber(emoji) {
		return this.constructor.numbers[emoji];
	}

	/**
  * Constructs a displayed instance of the table
  * @getter
  */
	get displayTable() {
		return util.codeBlock(this.table.join('\n------------------\n').replace(/,/g, '|'));
	}

	/**
  * Gets a user object of the current player
  * @getter
  */
	get currentMember() {
		return this.members[this.turn % 2];
	}

	/**
  * Gets the symbol of the current player
  * @getter
  */
	get symbol() {
		return this.turn % 2 === 0 ? 'X' : 'O';
	}

}

TicTacToe.numbers = {
	'1⃣': 1,
	'2⃣': 2,
	'3⃣': 3,
	'4⃣': 4,
	'5⃣': 5,
	'6⃣': 6,
	'7⃣': 7,
	'8⃣': 8,
	'9⃣': 9
};

module.exports = TicTacToe;
