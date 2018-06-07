const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			bucket: 2,
			requiredConfigs: ['moderation.muteRole'],

			cooldown: 15,
			permissionLevel: 2,
			description: 'Mutes a user.',
			extendedHelp: [
				'This command will mute a user by giving them the configured mute role, after removing all their other roles.',
				'Configure the mute role using the conf command.',
				'To make the mute role untalkable to all channels, use the --configure flag with this command.',
				'Using this command on an already muted person will remove their mute role and add previous roles, thereby unmuting them.',
				'Use a duration with the --time flag. For example: mute @Stitch#9441 making the bot --time="2 minutes"'
			].join('\n'),
			usage: '[member:user] [reason:str][...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		if (msg.flags.configure) return msg.guild.moderation.configureMuteRole();
		// timed mutes coming soon
		if (user === msg.author) throw 'You can\'t mute yourself!';
		const member = await msg.guild.members.fetch(user);
		if (!member) return msg.send('That guy isn\'t even in the server smh.');
		if (!member.roles.has(msg.guild.configs.moderation.muteRole)) {
			reason = reason ? reason.join(this.usageDelim) : `No reason provided. Use ${msg.guildConfigs.prefix}reason to update.`;
			await msg.guild.moderation.registerMute(member, reason);
			Promise.all(member.roles.map(role => member.roles.remove(role)));
			await member.roles.add(msg.guild.configs.moderation.muteRole);
			await user.send(`You have been muted in server \`${msg.guild.name}\` by ${msg.author.tag}. 
        
Reason: ${reason}`).catch(() => null);
			return msg.send(`Succesfully muted ${user.tag}`);
		}

		let log = await this.provider.get('mutes', msg.guild.id);
		if (!log) {
			await this.provider.create('mutes', msg.guild.id, { data: [] });
			log = await this.provider.get('mutes', msg.guild.id);
		}
		const usersLog = log.data.find(dataPiece => dataPiece.user === member.id);
		if (!usersLog) {
			await member.roles.remove(msg.guild.configs.moderation.muteRole);
		} else {
			const usersOldRoles = usersLog.roles;
			Promise.all(usersOldRoles.map(role => member.roles.add(role)));
		}
		return msg.send('Succesfully unmuted the user.');
	}

	get provider() {
		return this.client.providers.get('json');
	}

};
