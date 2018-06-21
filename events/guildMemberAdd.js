const { Event, Duration: { toNow } } = require('klasa');

module.exports = class extends Event {

	async run(member) {
		if (member.guild.configs.welcomer.channel && member.guild.configs.welcomer.greeting) await this.greet(member);
		if (member.guild.configs.channels.memberlog) await this.memberlog(member);
		if (member.guild.configs.roles.auto.length) await this.autorole(member);
		const stickyroles = await this.r.table('stickyroles').get(member.guild.id).run();
		if (stickyroles && stickyroles.enabled && stickyroles.members.find(mem => mem.id === member.id)) await this.stickyroles(member, stickyroles);
	}

	async greet(member) {
		const channel = member.guild.channels.get(member.guild.configs.welcomer.channel);
		if (!channel || !channel.postable) return;
		await channel.send(member.guild.configs.welcomer.greeting
			.replace(/{member}/g, member.toString())
			.replace(/{membername}/g, member.user.username)
			.replace(/{membertag}/g, member.user.tag)
			.replace(/{server}/g, member.guild.name)
		).catch(() => null);
	}

	async memberlog(member) {
		const fromNow = toNow(member.user.createdAt);
		const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
		await member.guild.channels.get(member.guild.configs.channels.memberlog).send({
			embed: new this.client.methods.Embed()
				.setAuthor(`${member.user.tag} [${member.user.id}]`, member.user.displayAvatarURL())
				.setDescription(`**Joined Discord**: ${fromNow} ago ${isNew}`)
				.setFooter('Joined', this.client.user.displayAvatarURL())
				.setColor(200 * 256)
				.setTimestamp()
		}).catch(() => null);
	}

	async autoRole(member) {
		await Promise.all(member.guild.configs.roles.auto.map(role => member.roles.add(role))).catch(() => null);
	}

	async stickyroles(member, stickyroles) {
		const stickymember = stickyroles.find(mem => mem.id === member.id);
		Promise.all(stickymember.roles.map(role => member.roles.add(role).catch(() => null)));
	}

	get r() {
		return this.client.providers.default.db;
	}


};
