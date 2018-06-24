module.exports = class Case {

	constructor(guild, type, user, moderator, reason) {
		this.guild = guild;
		this.client = guild.client;
		this.type = type;
		this.user = user;
		this.moderator = moderator;
		this.reason = reason || 'No reason provided.';
		this.case = 0;
	}

	async send() {
		const _channel = this.client.channels.get(this.guild.configs.moderation.modlog);
		if (!_channel) throw 'The mod log doesn\'t exist. Did it get deleted?';
		this.case = await this.getCase();
		return _channel.send({ embed: this.embed });
	}

	async getCase() {
		const modlogs = await this.provider.get('modlogs', this.guild.id);
		if (!modlogs) return this.provider.create('modlogs', this.guild.id, { logs: [this.pack] }).then(() => this.case);
		this.case = modlogs.logs.length;
		modlogs.logs.push(this.pack);
		await this.provider.replace('modlogs', this.guild.id, modlogs);
		return modlogs.logs.length;
	}

	static color(type) {
		switch (type) {
			case 'ban': return 16724253;
			case 'unban': return 1822618;
			case 'warn': return 16564545;
			case 'kick': return 16573465;
			case 'softban': return 15014476;
			default: return 16777215;
		}
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

	get embed() {
		const embed = new this.client.methods.Embed()
			.setAuthor(this.moderator.tag, this.moderator.displayAvatarURL())
			.setColor(this.constructor.color(this.type))
			.setDescription([
				`**Type**: ${this.type}`,
				`**User**: ${this.user.tag} (${this.user.id})`,
				`**Reason**: ${this.reason || `Use \`${this.guild.configs.prefix}reason ${this.case} to claim this log.\``}`
			])
			.setFooter(`Case ${this.case < 1 ? 0 : this.case - 1}`)
			.setTimestamp();
		return embed;
	}

	get pack() {
		return {
			type: this.type,
			user: {
				id: this.user.id,
				tag: this.user.tag
			},
			moderator: {
				id: this.moderator.id,
				tag: this.moderator.tag
			},
			reason: this.reason,
			case: this.case
		};
	}

};
