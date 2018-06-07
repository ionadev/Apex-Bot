const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Play a game of connect 4.',
			usage: '<opponent:username>',
			cooldown: 15,
			aliases: ['c4'],
			botPerms: ['MANAGE_MESSAGES', 'ADD_REACTIONS']
		});

		this.dbl = true;
		this.delayer = time => new Promise(res => setTimeout(() => res(), time));

		this.yesNo = ['✔', '✖'];
		this.numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '⏹'];
		this.channels = new Map();
	}


	async run(message, [user]) {
		const c4 = message.channel.connect4;
		if (this.channels.has(message.channel.id)) throw message.language.get('COMMAND_GAME_OCCURING');
		if (user.bot) throw message.language.get('COMMAND_GAME_NOBOTS');
		if (user === message.author) throw message.language.get('COMMAND_GAME_YOURSELF');
		const msg = await message.channel.send(message.language.get('COMMAND_GAME_CHALLENGE', user));
		// adding the yes/No emoji for asking the mentioned user to either play the game or not.
		const check = await awaitReaction(user, msg);
		if (!check) throw message.language.get('COMMAND_GAME_DECLINED');

		await msg.reactions.removeAll();
		c4.startGame(message, user);
		this.channels.set(msg.channel.id, true);
		msg.edit(msg.language.get('COMMAND_GAME_LOADING'));
		await c4.initialReact(msg);
		return this.handleProgress(msg, c4);
	}

	async handleProgress(msg, c4) {
		const { players, choice, table } = c4;
		const usr = players[choice % 2];

		await msg.edit(c4.turnTable());
		msg.awaitReactions((r, user) => user.id === usr && this.numbers.includes(r.emoji.toString()), { time: 60000, max: 1, errors: ['time'] })
			.then(async (reactions) => {
				const res = reactions.first();
				if (res._emoji.name === '⏹') {
          await msg.channel.send(`${this.client.users.get(usr).toString()} has decided to quit. He loses!`);
                c4.reset();
				msg.reactions.removeAll();
				this.channels.delete(msg.channel.id);
          return
        }
				const column = this.numbers.indexOf(res._emoji.name);

				// if the column is full
				if (!c4.checkColumnPossible(column)) {
					await msg.channel.send(msg.language.get('COMMAND_C4_COLLUMNFULL', usr));
					await res.users.remove(usr);
					return this.handleProgress(msg, c4);
				}

				// if the selected move is possible
				c4.updateTable(usr, column);
				// checking if game is over
				const win = c4.check(usr);
				if (win) {
					const output = `${msg.language.get('COMMAND_C4_WIN', usr)}\n\n${c4.getTable()}`;
					c4.reset();
					msg.reactions.removeAll();
					this.channels.delete(msg.channel.id);
					return msg.edit(output);
				}
				// checking if no further move is possible
				const draw = c4.checkNoMove();
				if (draw) {
					const output = `${msg.language.get('COMMAND_C4_MAXMOVES')}\n${c4.getTable()}`;
					c4.reset();
					msg.reactions.removeAll();
					this.channels.delete(msg.channel.id);

					return msg.edit(output);
				}
				c4.choice += 1;
				await res.users.remove(usr);
				this.handleProgress(msg, c4);
			})
			.catch((e) => {
      c4.reset();
				msg.reactions.removeAll();
				this.channels.delete(msg.channel.id);

				return msg.send(msg.language.get('COMMAND_C4_TIMEOUT', usr));
			});
	}

	abort(user, msg, c4) {
		c4.reset();
		msg.reactions.removeAll();
		this.channels.delete(msg.channel.id);
		return msg.send(msg.language.get('COMMAND_C4_QUIT', user));
	}

};

const awaitReaction = async (user, message) => {
	await message.react('🇾');
	await message.react('🇳');
	const data = await message.awaitReactions(reaction => reaction.users.has(user.id), { time: 30000, max: 1 });
	if (data.firstKey() === '🇾') return true;
	return false;
};
