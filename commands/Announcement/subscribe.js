const { Command } = require('klasa')

module.exports = class extends Command {
  
    constructor(...args) {
        super(...args, { description: 'Gives/takes the server\'s subscriber role, if any.' })
    }
  
    async run(msg) {
      if (!msg.guild.configs.roles.announcementRole) return msg.errMsg(msg.language.get('COMMAND_SUBSCRIBE_NOROLE'))
      const role = msg.guild.roles.get(msg.guild.configs.roles.announcement)
      
      if (msg.member.roles.has(role.id)) {
        return msg.member.removeRole(role)
          .then(() => msg.sendMessage(msg.language.get('COMMAND_SUBSCRIBE_ROLE', 'Removed', role))) 
      } else
        return msg.member.addRole(role)
          .then(() => msg.sendMessage(msg.language.get('COMMAND_SUBSCRIBE_ROLE', 'Added', role))) 
    } 
} 