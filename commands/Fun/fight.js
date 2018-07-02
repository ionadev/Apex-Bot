const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Engage in a turn based strategy game against a user.',
			usage: '<opponent:username>',
			cooldown: 10
		});

		this.fighting = new Set();
		this.customizeResponse('opponent', msg => msg.language.get('CUSTOMPROMPT_FIGHT'));
	}

	async run(msg, [opponent]) {
		if (opponent.bot) throw msg.language.get('COMMAND_GAME_NOBOTS');
		if (opponent === msg.authot) throw msg.language.get('COMMAND_GAME_YOURSELF');
		if (this.fighting.has(msg.channel.id)) throw msg.language.get('COMMAND_GAME_OCCURING');

		await msg.channel.send(msg.language.get('COMMAND_GAME_CHALLENGE', opponent));
		const verify = await msg.channel.awaitMessages(res => res.author.id === opponent.id, {
			max: 1,
			time: 30000
		});

		if (!verify.size || !['yes', 'y'].includes(verify.first().content.toLowerCase())) {
			this.fighting.delete(msg.channel.id);
			return msg.channel.send(msg.language.get('COMMAND_GAME_DECLINED'));
		}

		let userHP = 500;
		let oppoHP = 500;
		let userTurn = false;
		let guard = false;
		const reset = (changeGuard = true) => {
			userTurn = !userTurn;
			if (changeGuard && guard) guard = false;
		};
		const dealDamage = (damage) => {
			if (userTurn) oppoHP -= damage;
			else userHP -= damage;
		};
		const forfeit = () => {
			if (userTurn) userHP = 0;
		};
		while (userHP > 0 && oppoHP > 0) {
			const user = userTurn ? msg.author : opponent;
			let choice;
			if (!opponent.bot || (opponent.bot && userTurn)) {
				await msg.channel.send(msg.language.get('COMMAND_FIGHT_TURN', user, msg, opponent, userHP, oppoHP));
				const turn = await msg.channel.awaitMessages(res => res.author.id === user.id, {
					max: 1,
					time: 30000
				});
				if (!turn.size) {
					await msg.channel.send(msg.language.get('COMMAND_FIGHT_TIMEOUT'));
					forfeit();
					break;
				}
				choice = turn.first().content.toLowerCase();
			} else {
				const choices = ['fight', 'guard', 'special'];
				choice = choices[Math.floor(Math.random() * choices.length)];
			}
			if (choice === 'fight') {
				const damage = Math.floor(Math.random() * (guard ? 10 : 100)) + 1;
				await msg.channel.send(`${user} deals **${damage}** damage!`);
				dealDamage(damage);
				reset();
			} else if (choice === 'guard') {
				await msg.channel.send(`${user} guards!`);
				guard = true;
				reset(false);
			} else if (choice === 'special') {
				const hit = Math.floor(Math.random() * 4) + 1;
				if (hit === 1) {
					const damage = Math.floor(Math.random() * (((guard ? 300 : 150) - 100) + 1)) + 100;
					await msg.channel.send(`${user} deals **${damage}** damage!`);
					dealDamage(damage);
					reset();
				} else {
					await msg.channel.send(`${user}'s attack missed!`);
					reset();
				}
			} else if (choice === 'run') {
				await msg.channel.send(`${user} flees!`);
				forfeit();
				break;
			} else {
				await msg.channel.send(`${user}, I do not understand what you want to do.`);
			}
		}
		this.fighting.delete(msg.channel.id);
		return msg.channel.send(msg.language.get('COMMAND_FIGHT_DONE', msg, opponent, userHP, oppoHP));
	}

};
