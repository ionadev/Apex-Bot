const { Command, Duration } = require('klasa');
const { MessageAttachment } = require('discord.js');
const { loadavg } = require('os');
const splashy = require('splashy')();
const { HighChartsConstructor } = require('chart-constructor');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_STATS_DESCRIPTION'),
			extendedHelp: [
				'Flags:',
				'',
				'--commands: Shows command statistics.',
				'--memory: Shows memory statisitcs.'
			].join('\n')
		});
	}

	async run(msg) {
		const [color] = await splashy.fromUrl(this.client.user.avatarURL({ format: 'png' }));
		const commandsRun = this.client.usedCommands.reduce((prev, val) => val.count + prev, 0);
		const [popularCommand] = this.client.usedCommands.sort((a, b) => a.count > b.count ? -1 : 1);
		const embed = new this.client.methods.Embed()
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setColor(color)
			.setTimestamp();
		embed.setDescription(`To add Apex to your Discord server, use the \`${msg.guildConfigs.prefix}invite\` command.`)
			.addField('Commands', `**Processed**: ${commandsRun}\n**Most used**: ${popularCommand[0]}`, true)
			.addField('Memory', `**RAM (Used)**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
**RAM (Total)**: ${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100} MB
**CPU Usage**: ${Math.round(loadavg()[0] * 100) / 100}%`, true)
			.addField('Other', `**Uptime**: ${Duration.toNow(Date.now() - (process.uptime() * 1000))}
**Shard**: ${this.client.shard.id}`);

		if (msg.flags.commands) {
			const chart = await new HighChartsConstructor()
				.seriesDataSetter([
					{
						type: 'line',
						color: '#3498DB',
						data: this.client.health.cmd.slice(-10),
						name: 'Commands per minute.'
					}
				])
				.titleOptions({ text: 'Chart' })
				.toBuffer();
			embed
				.attachFiles([new MessageAttachment(chart, 'chart.png')])
				.setImage('attachment://chart.png');
		} else if (msg.flags.memory) {
			const chart = await new HighChartsConstructor()
				.seriesDataSetter([
					{
						type: 'line',
						color: '#3498DB',
						data: this.client.health.ram.slice(-10),
						name: 'RAM (Used)'
					},
					{
						type: 'line',
						color: '#FF8000',
						data: this.client.health.prc.slice(-10),
						name: 'RAM (Total)'
					}
				])
				.titleOptions({ text: 'Chart' })
				.toBuffer();
			embed
				.attachFiles([new MessageAttachment(chart, 'chart.png')])
				.setImage('attachment://chart.png');
		}

		return msg.sendEmbed(embed);
	}

};
