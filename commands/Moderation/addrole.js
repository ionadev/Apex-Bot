const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Adds a role to the nominated user.',
			usage: '<member:member> <role:rolename>',
			usageDelim: ' ',
			botPerms: ['MANAGE_ROLES'],
			cooldown: 5,
			permissionLevel: 2,
			aliases: ['sr', 'roleadd']
		});
	}

	async run(msg, [member, role]) {
		if (member.roles.has(role.id)) return msg.send('They already have that role!');
		if (role.position >= msg.guild.me.roles.highest.position) {
			return msg.send('That role is higher or at the same position as me and I cannot add it.');
		}

		return member.roles.add(role)
			.then(() => msg.sendMessage(`Added role **${role.name}** to ${member.user.tag}`))
			.catch(e => this.client.emit('error', e));
	}

};
