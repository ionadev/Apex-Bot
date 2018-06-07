const { Event } = require('klasa');

module.exports = class extends Event {

	async run(messages) {
		for (const msg of messages) this.client.emit('messageDelete', msg);

		const msg = messages.first();
		if (!msg.guild || !msg.guild.configs.logs.channel || !msg.guild.configs.logs.messageDeletes) return;

		if (!msg.id || !msg.content) return;

		const channel = msg.guild.channels.get(msg.guildConfigs.logs.channel);

		if (!channel || !channel.embedable) return;

		const log = messages.map(m => `${m.createdAt} (${m.guild.id} / #${m.channel.id} / ${m.author.id}) ${m.author.tag} : ${m.cleanContent}`).join('\n');
		const hasteURL = await require('snekfetch')
			.post('https://hastebin.com/documents')
			.send(log).catch(e => { throw new Error(`Error posting data: ${e}`); });
		const url = `http://hastebin.com/${hasteURL.body.key}.txt`;

		channel.send(`<#${msg.channel.id}>`, {
			embed: new this.client.methods.Embed()
				.setDescription(`${messages.size} messages deleted.\n${url}`)
		});
	}

};
