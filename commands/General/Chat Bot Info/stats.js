const { Command, Duration } = require('klasa');
const { loadavg } = require('os');
const splashy = require('splashy')();

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(msg) {
		const [color] = await splashy.fromUrl(this.client.user.avatarURL({ format: 'png' }));
		return msg.sendEmbed(new this.client.methods.Embed()
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setColor(color)
			.addField('Guilds', this.client.guilds.size, true)
			.addField('Members', this.client.guilds.reduce((prev, val) => val.memberCount + prev, 0), true)
			.addField('Channels', this.client.channels.size, true)
			.addField('Node.js', process.version, true)
			.addField('RAM (Used)', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
			.addField('RAM (Total)', `${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100}MB`, true)
			.addField('CPU Usage', `${Math.round(loadavg()[0] * 100) / 100}%`, true)
			.addField('Uptime', Duration.toNow(Date.now() - (process.uptime() * 1000)), true)
			.addField('Commands run', this.client.commandsUsed));
	}

};
