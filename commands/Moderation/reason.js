const { Command, util } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            requiredSettings: ['moderation.modlog'],
            aliases: ['setreason'],
            bucket: 2,
            cooldown: 5,
            promptLimit: 0,
            permissionLevel: 2,
            description: 'This command edits the reason of a moderation log case.',
            extendedHelp: 'This command will edit the embed used in the mod-log. It will not, however, edit the database directly.',
            usage: '<case:integer> <reason:string> [...]',
            usageDelim: ' ',
        });
    }

    async run(msg, [selected, ...reason]) {
        selected--;
        reason = reason.length > 0 ? reason.join(' ') : null;

        const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
        const log = modlogs.logs[selected];
        if (!log) throw 'There is no mod-log under that case.';

        const channel = msg.guild.channels.get(msg.guild.configs.moderation.modlog);
        if (!channel) throw 'The mod-log channel does not exist. Did it get deleted?';
        const messages = await channel.messages.fetch({ limit: 100 });
        const message = messages.find(mes => mes.author.id === this.client.user.id &&
            mes.embeds.length > 0 &&
            mes.embeds[0].footer && mes.embeds[0].footer.text === `Case ${selected + 1}`
        );

        if (message) {
            const embed = message.embeds[0];
            const [type, user] = embed.description.split('\n');
            embed.description = [
                type,
                user,
                `**Reason**: ${reason}`
            ].join('\n');
            await message.edit({ embed });
        } else {
            const embed = new this.client.methods.Embed()
                .setAuthor(log.moderator.tag)
                .setColor(colour(log.type))
                .setDescription([
                    `**Type**: ${log.type}`,
                    `**User**: ${log.user.tag} (${log.user.id})`,
                    `**Reason**: ${reason}`
                ])
                .setFooter(`Case ${selected}`)
                .setTimestamp();
            await channel.send({ embed });
        }

        const oldReason = log.reason;

        modlogs.logs[selected].reason = reason;
        await this.provider.replace('modlogs', msg.guild.id, modlogs);
        return msg.send(`Successfully updated the log ${selected + 1}.${util.codeBlock('http', [
            `Old reason : ${oldReason || 'Not set.'}`,
            `New reason : ${reason}`
        ].join('\n'))}`);
    }

    get provider() {
        return this.client.providers.default;
    }

};

function colour(type) {
    switch (type) {
        case 'ban': return 16724253;
        case 'unban': return 1822618;
        case 'warn': return 16564545;
        case 'kick': return 16573465;
        case 'softban': return 15014476;
        default: return 16777215;
    }
}
