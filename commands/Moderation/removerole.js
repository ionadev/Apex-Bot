const { Command } = require('klasa')

module.exports = class extends Command {
  
    constructor(...args) {
        super(...args, {
          description: 'Removes a role from the nominated user.',
          usage: '<member:member> <role:rolename>',
          usageDelim: ' ',
          botPerms: ['MANAGE_ROLES'],
          cooldown: 5,
          permissionLevel: 2,
          aliases: ['dr', 'roleremove'] 
        }) 
    }
   
    async run(msg, [member, role]) {
      
      if (!role) return msg.send('Invalid role.')
      
      if (!member.roles.has(role.id)) return msg.send('They do not have that role!')
      if (role.position >= msg.guild.me.roles.highest.position) {
        return msg.send('That role is higher or at the same position as me and I cannot remove it.') 
      }
      
      return member.roles.remove(role)
        .then(() => msg.sendMessage(`Removed role **${role.name}** from ${member.user.tag}`))
        .catch(e => this.client.emit('error', e)) 
    } 
} 