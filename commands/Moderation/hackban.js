const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			botPerms: ['BAN_MEMBERS'],
			bucket: 2,
			cooldown: 5,
			permissionLevel: 3,
			description: 'Bans an arbitrary member.',
			extendedHelp: 'This command will ban members despite they not being in your server. Useful for pre banning trolls, hackers, known perpetrators.',
			usage: '<user:user> [reason:str][...]'
		});
	}

	async run(msg, [user, ...reason]) {
		if (user === msg.author) throw 'You cannot hackban yourself lol.';
		reason = reason ? reason.join(this.usageDelim) : `No reason provided. Use ${msg.guildConfigs.prefix}reason to update.`;
		await msg.guild.members.ban(user, { reason });
		await msg.guild.moderation.register('ban', reason, msg.author, user);
		return msg.send(`Succesfully hackbanned the user ${user.tag}`);
	}

};
