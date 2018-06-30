const { Command, Timestamp, Duration: { toNow }, util } = require('klasa');
const splashy = require('splashy')();

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['server'],
			description: 'Shows statistics about the server.',
			runIn: ['text'],
			requiredPermissions: ['EMBED_LINKS']
		});

		this.timestamp = new Timestamp('dddd, MMMM d YYYY');
	}

	async run(msg) {
		await msg.guild.members.fetch();
		const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];
		const { name, id, channels, afkChannel, members, owner, roles, region, createdAt, memberCount } = msg.guild;
		const TC = channels.filter(c => c.type === 'text');
		const VC = channels.filter(c => c.type === 'voice');
		const CC = channels.filter(c => c.type === 'category');
		const afk = afkChannel ? afkChannel.name : 'None';

		const memberss = await msg.guild.members.fetch();

		const gg = memberss.filter(e => e.presence.status !== 'offline').size;
		const ff = memberss.size - gg;
		const bots = msg.guild.members.filter(e => e.user.bot).size;
		const [color] = await splashy.fromUrl(msg.guild.iconURL({ format: 'png' }));

		const embed = new this.client.methods.Embed()
			.setAuthor(`${name} (${id})`, msg.guild.iconURL())
			.setColor(color)
			.addField(
				'Channels',
				`• **${TC.size}** Text, **${VC.size}** Voice, **${CC.size}** Categories.
• AFK: **${afk}**`, true,
			)
			.addField(
				'Members',
				`• **${memberCount - bots}** Members (**${bots}** Bots).
• Owner: **${owner.user.tag}**
 (ID: **${owner.user.id}**)`, true
			)
			.addField(
				'Other',
				`• Roles: **${roles.size}**
• Region: **${region}**
• Created at: **${this.timestamp.display(createdAt)}** (${toNow(createdAt)} ago.)
• Verification level: ${util.toTitleCase(verificationLevels[msg.guild.verificationLevel])}`, true
			)
		/* .addField(
      "Users",
      `• Online users: **${gg}** (${Math.round(gg / memberCount * 100)}% users online)`, true
    )*/
			.setThumbnail(msg.guild.iconURL());

		return msg.sendEmbed(embed);
	}

};
