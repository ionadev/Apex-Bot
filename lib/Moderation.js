const Case = require('./Case');
const { EventEmitter } = require('events');

module.exports = class Moderation {

	constructor(guild) {
		this.guild = guild;
		this.client = guild.client;
		this.emitter = new EventEmitter();
		this.emitter.on('muteRegistered', this._muteRegistered.bind(this));
		this._cache = new Map();
	}

	async register(type, reason, moderator, user) {
		if (!type) throw new ReferenceError('Type is a required argument.');
		if (!moderator) throw new ReferenceError('Moderator is a required argument.');
		this._cache.set(new Date().toString('hex'), { moderator, user, type });
		return new Case(this.guild, type, user, moderator, reason).send();
	}

	async registerMute(user, reason) {
		let mutes = await this.provider.get('mutes', this.guild.id);
		if (!mutes) {
			await this.provider.create('mutes', this.guild.id, { data: [] });
			mutes = await this.provider.get('mutes', this.guild.id);
		}
		mutes.data.push({
			user: user.id,
			reason,
			roles: [...user.roles.keys()]
		});
		await this.provider.replace('mutes', this.guild.id, mutes);
		return this.emitter.emit('muteRegistered', user, reason);
	}

	configureMuteRole() {
		const muteRole = this.guild.roles.get(this.guild.configs.moderation.muteRole);
		if (!muteRole) throw 'The mute role does not exist. Did it get deleted?';
		for (const channel of this.guild.channels.values()) {
			channel.overwritePermissions(muteRole, { SEND_MESSAGES: false });
		}
		return this;
	}

	_muteRegistered() {
		// wip
	}

	get recentActions() {
		return {
			actions: this._cache.size,
			actionArray: this._cache.map(cached => cached.type)
		};
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
