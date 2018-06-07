const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreOthers: false,
			ignoreEdits: false
		});

		this.INVITE_REGEX = /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/;
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.configs.automod.antiinvite) return;
		if (await msg.hasAtLeastPermissionLevel(2)) return;
		if (!this.INVITE_REGEX.test(msg.content)) return;
		if (msg.deletable) {
			msg.delete()
				.then(msg.sendMessage(`${msg.author}, you may not post invite links in this server.`))
				.catch(err => this.client.emit('error', err));
		}
	}

};
