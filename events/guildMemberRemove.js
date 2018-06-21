const { Event, Duration: { toNow } } = require('klasa');

module.exports = class extends Event {

	async run(member) {
		if (member.guild.configs.welcomer.channel && member.guild.configs.welcomer.farewell) await this.farewell(member);
		if (member.guild.configs.channels.memberlog) await this.memberlog(member);
		const stickyroles = await this.r.table('stickyroles').get(member.guild.id).run();
		if (stickyroles && stickyroles.enabled && member.roles.size) await this.stickyroles(member);
	}

	async farewell(member) {
		const channel = member.guild.channels.get(member.guild.configs.welcomer.channel);
		if (!channel || !channel.postable) return;
		await channel.send(member.guild.configs.welcomer.farewell
			.replace(/{member}/g, member.toString())
			.replace(/{membername}/g, member.user.username)
			.replace(/{membertag}/g, member.user.tag)
			.replace(/{server}/g, member.guild.name)
		).catch(() => null);
		return;
	}

	async memberlog(member) {
		const memberlogs = member.guild.channels.get(member.guild.configs.channels.memberlog);
		const text = Date.now() - member.joinedTimestamp <= 120000 ? '🚪🏃💨' : '';
		await memberlogs.send({
			embed: new this.client.methods.Embed()
				.setColor((200 * 256 * 256) + 100)
				.setAuthor(`${member.user.username} #${member.user.discriminator} [${member.user.id}]`, member.user.displayAvatarURL())
				.setDescription(`Joined this Server: ${toNow(member.joinedAt)} ago. ${text}`)
				.setTimestamp()
				.setFooter('Left', this.client.user.displayAvatarURL())
		});
	}

	async stickyroles(member) {
		const stickyroles = await this.r.table('stickyroles').get(member.guild.id).run();
		const check = stickyroles.members.find(mem => mem.id === member.id);
		if (check) stickyroles.splice(stickyroles.members.indexOf(check), 1);
		stickyroles.members.push({
			id: member.id,
			roles: member.roles.map(role => role.id)
		});
		await this.r.table('stickyroles').update(stickyroles);
		return null;
	}

	get r() {
		return this.client.providers.default.db;
	}


};
