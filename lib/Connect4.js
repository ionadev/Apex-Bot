/* eslint-disable complexity  */

const emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '⏹'];

module.exports = class Connect4 {

	/**
    * @param {TextChannel} textChannel The channel this game is being played in.
    */
	constructor(textChannel) {
		Object.defineProperty(this, 'client', { value: textChannel.client });

		this.status = 'idle';
		this.players = [];
		this.choice = 0;
		/* eslint-disable max-len */
		this.table = [
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>']
		];
		/* eslint-enable max-len */
	}

	/**
  * Returns a stringified table.
  * @returns {string} output The stringified version of the table
  * @since 1.0.0
  */
	getTable() {
		const output = this.table.map(array => array.join('')).join('\n');
		return output;
	}

	// react with all the numbers
	async initialReact(msg) {
		for (const emoji of emojis) {
			await msg.react(emoji);
		}
	}

	// the table self-produced for every turn
	turnTable() {
		let output = 'Current turn: ';
		output += `<@${this.players[this.choice % 2]}>\n\n`;
		output += this.getTable();
		return output;
	}

	// check column
	checkColumnPossible(num) {
		for (let i = this.table.length - 1; i >= 0; i--) {
			if (this.table[i][num] === '<:empty:443042498638643221>') return true;
		}
		return false;
	}

	// check if further moves are possible in the game
	checkNoMove() {
		for (let i = 0; i < this.table[0].length; i++) {
			for (let j = 0; j < this.table.length; j++) {
				if (this.table[i][j] === '<:empty:443042498638643221>') return false;
			}
		}
		return true;
	}

	// updating the table
	updateTable(user, num) {
		const color = this.getColor(user);
		for (let i = this.table.length - 1; i >= 0; i--) {
			if (this.table[i][num] === '<:empty:443042498638643221>') {
				this.table[i][num] = color;
				return;
			}
		}
	}

	// initially start the table.
	startGame(message, user) {
		this.players.push(message.author.id, user.id);
		this.status = 'playing';
		return this.players;
	}

	// get the color of the user
	getColor(userId) {
		const pos = this.players.indexOf(userId);
		const color = pos % 2 === 0 ? '<:p1:397395769285541889>' : '<:p2:397395466234626050>';
		return color;
	}

	// get the proper winning color according to the user color
	getWinColor(color) {
		return color === '<:p1:397395769285541889>' ? '<:p1win:397394906563215360>' : '<:p2win:397395151762227200>';
	}

	check(user) {
		const { table } = this;
		const player = this.getColor(user);
		const winCol = this.getWinColor(player);
		// horizontal check
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 4; j++) {
				const row = table[i];
				if (row[j] === player && row[j + 1] === player && row[j + 2] === player && row[j + 3] === player) {
					this.table[i][j] = winCol;
					this.table[i][j + 1] = winCol;
					this.table[i][j + 2] = winCol;
					this.table[i][j + 3] = winCol;
					return true;
				}
			}
		}
		// vertical check
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 7; j++) {
				if (table[i][j] === player && table[i + 1][j] === player && table[i + 2][j] === player && table[i + 3][j] === player) {
					this.table[i][j] = winCol;
					this.table[i + 1][j] = winCol;
					this.table[i + 2][j] = winCol;
					this.table[i + 3][j] = winCol;
					return true;
				}
			}
		}
		// right diagonal check
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				if (table[i][j] === player && table[i + 1][j + 1] === player && table[i + 2][j + 2] === player && table[i + 3][j + 3] === player) {
					this.table[i][j] = winCol;
					this.table[i + 1][j + 1] = winCol;
					this.table[i + 2][j + 2] = winCol;
					this.table[i + 3][j + 3] = winCol;
					return true;
				}
			}
		}
		// left diagonal check
		for (let i = 0; i < 3; i++) {
			for (let j = 3; j < 7; j++) {
				if (table[i][j] === player && table[i + 1][j - 1] === player && table[i + 2][j - 2] === player && table[i + 3][j - 3] === player) {
					this.table[i][j] = winCol;
					this.table[i + 1][j - 1] = winCol;
					this.table[i + 2][j - 2] = winCol;
					this.table[i + 3][j - 3] = winCol;
					return true;
				}
			}
		}
		return false;
	}

	// complete reset the information in the table
	reset() {
		this.status = 'idle';
		this.players = [];
		this.choice = 0;
		/* eslint-disable max-len */
		this.table = [
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>'],
			['<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>', '<:empty:443042498638643221>']
		];
		return true;
		/* eslint-enable max-len */
	}

};
