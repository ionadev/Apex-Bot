const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            bucket: 2,
            cooldown: 10,
            permissionLevel: 2,
            description: 'Kicks the nominated user.',
            extendedHelp: 'This command will kick the mentioned user, and log the action to the moderation log, if any.',
            usage: '<user:user> [reason:str][...]',
            usageDelim: ' ',
        });
    }

    async run(msg, [user, ...reason]) {
        if (user === msg.author) throw 'You can\'t warn yourself!';
        const member = await msg.guild.members.fetch(user);
        if (!member) return msg.send('That guy isn\'t even in the server smh.');
        if (!member.kickable) throw 'I cannot kick that member.';
        if (member.roles.highest.position >= msg.member.roles.highest.position) throw 'You cannot kick members of equal or greater rank.';
        reason = reason ? reason.join(this.usageDelim) : `No reason provided. Use ${msg.guildConfigs.prefix}reason to update.`;
        await msg.guild.moderation.register('kick', reason, msg.author, user);
        await member.kick(reason);
        await user.send(`You have been kicked from server \`${msg.guild.name}\` by ${msg.author.tag}. 
        
        Reason: ${reason}`).catch(() => null);
        return msg.send(`Succesfully kicked ${user.tag}`);
    }
};
