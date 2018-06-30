const { Command, Timestamp, Duration: { toNow } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Shows information about the nominated user.',
			usage: '[user:username]',
			cooldown: 5,
			botPerms: ['EMBED_LINKS'],
			aliases: ['ui', 'user']
		});

		this.timestamp = new Timestamp('dddd, MMMM d YYYY');
	}

	async run(msg, [member = msg.author]) {
		member = msg.guild.member(member);

		const color = member.colorRole ? member.colorRole.color : 'RANDOM';
		const position = msg.guild.members
			.sort((a, b) => a.joinedAt > b.joinedAt ? 1 : -1)
			.map(u => u.user.id)
			.indexOf(member.user.id) + 1;
		const embed = new this.client.methods.Embed()
			.setThumbnail(member.user.avatarURL())
			.setColor(color)
			.setAuthor(`${member.user.tag} [${member.id}]`, member.user.avatarURL())
			.setDescription(`Status: ${member.user.presence.status || 'offline'}. 
 
Joined Discord on ${this.timestamp.display(member.user.createdAt)} (${toNow(member.user.createdAt)})
Joined ${msg.guild.name} on ${this.timestamp.display(member.joinedAt)} (${toNow(member.joinedAt)})`)
			.addField('• Role(s)', member.roles.map(e => e.name).slice(0, -1).sort().join(', ') || 'No roles')
			.addField('• Other', `Joined position: ${position}`)
			.setFooter(this.client.user.username, this.client.user.avatarURL())
			.setTimestamp();

		return msg.sendEmbed(embed);
	}

};
