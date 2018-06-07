const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            bucket: 2,
            cooldown: 15,
            permissionLevel: 2,
            description: 'Check a case.',
            extendedHelp: 'This command shows you details of a specific mod-log case.',
            usage: '<case:int>',
        });

        this.provider = null
        this
            .customizeResponse('case', 'Which case would you like to check?')
    }

    async run(msg, [caseNum]) {
        caseNum--;
        const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data.logs || []);
        const log = modlogs[caseNum];
        if (!log) throw 'There is no log under that case.';
        return msg.send([
            `User      : ${log.user.tag} (${log.user.id})`,
            `Moderator : ${log.moderator.tag} (${log.moderator.id})`,
            `Reason    : ${log.reason || 'No reason provided.'}`
        ].join('\n'), { code: 'http' })
    }

    async init() {
        this.provider = this.client.providers.get('json');
    }
};
