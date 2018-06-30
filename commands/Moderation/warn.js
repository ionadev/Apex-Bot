const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			cooldown: 15,
			bucket: 2,
			permissionLevel: 2,
			description: 'Warns a user.',
			usage: '<user:user> [reason:str][...]',
			usageDelim: ' ',
			extendedHelp: 'This command warns a user by sending him a DM. It will also log the case to the modlog if any.'
		});
	}

	async run(msg, [user, ...reason]) {
		if (user === msg.author) throw 'You can\'t warn yourself!';
		const member = await msg.guild.members.fetch(user);
		if (!member) return msg.send('That guy isn\'t even in the server smh.');
		reason = reason ? reason.join(this.usageDelim) : `No reason provided. Use ${msg.guildConfigs.prefix}reason to update.`;
		await msg.guild.moderation.register('warn', reason, msg.author, user);

		await user.send(`You have been warned in server \`${msg.guild.name}\` by ${msg.author.tag}. 
        
Reason: ${reason}`).catch(() => null);
		return msg.send(`Succesfully warned ${user.tag}.`);
	}

};
