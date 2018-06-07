const { Command, Argument, Timestamp } = require('klasa');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Quotes a message by ID.',
      usage: '[channel:channel] <message:str>',
      usageDelim: ' '
    })
    
    this.timestamp = new Timestamp('dddd d hh:mm');
  }
  
  async run(msg, [channel = msg.channel, id]) {
    if (!Argument.regex.snowflake.test(id)) throw 'Invalid message ID. Use developer mode to copy IDs.';
    const message = await channel.messages.fetch(id).catch(() => null);
    if (!message) throw 'Your message does not exist or is not in this channel. Try specifying the channel it is from.';
    await message.guild.members.fetch(message.author);
    return msg.sendEmbed(new this.client.methods.Embed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(message.member && message.member.displayColor ? message.member.displayColor : 'RANDOM')
      .setDescription(message.cleanContent)
      .setFooter(`Sent`)
      .setTimestamp(message.createdAt)
      .setImage(message.attachments.size ? message.attachments.first().url : null));
  }
}