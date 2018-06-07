const { Command } = require('klasa');
const { get } = require('snekfetch');

module.exports = class extends Command {
  
  constructor(...args) {
    super(...args, {
      description: 'Who do you ship?',
      cooldown: 5,
      usage: '<user:username> [user2:username]',
      usageDelim: ' '
    })
  }
  
  async run(msg, [shipped, shipper = msg.author]) {
    
    const first_length = Math.round(shipper.username.length / 2);
    const first_half = shipper.username.slice(0, first_length);
    const second_length = Math.round(shipped.username.length / 2);
    const second_half = shipped.username.slice(second_length);
    const final_name = first_half + second_half;
    const score = Math.random() * (0, 100);
    const prog_bar = Math.ceil(Math.round(score) / 100 * 10);
    const counter = "▰".repeat(prog_bar) + "▱".repeat(10 - prog_bar);

    const { body } = await get(`https://nekobot.xyz/api/imagegen/?type=ship&user1=${shipper.displayAvatarURL({ format: "png", size: 256 })}&user2=${shipped.displayAvatarURL({ format: "png", size: 256 })}`);
    
    return msg.send({
      embed: {
        "title": `${shipper.username} ❤ ${shipped.username}`,
        "description": `**Love %: ${score.toFixed(2)}**\n${counter}\n\n${final_name}`,
        "url": body.message,
        "color": 6192321,
        "image": {
          "url": body.message
        },
        "footer": {
          "icon_url": msg.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${msg.author.tag}`
        }
      }
    })
  }
}