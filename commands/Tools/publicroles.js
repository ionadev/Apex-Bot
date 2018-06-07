const { Command, util: { regExpEsc } } = require('klasa') 

module.exports = class extends Command {
 
    constructor(...args) {
        super(...args, {
          aliases: ['pr','give', 'take'],
          botPerms: ['MANAGE_ROLES'],
          description: 'Give or take public roles!',
          usage: '[role:rolename]' 
        })
      
        this.prefixMention = null
		    this.prefixMentionLength = null
	      this.prefixes = new Map()
        this.nick = new RegExp('^<@!')
    }
  
    async init() {
      /* if (!this.client.settings.guilds.schema.Roles.PublicRoles) {
        this.client.settings.guilds.schema.Roles.addKey('PublicRoles', { type: 'Role', array: true })
      }*/
      this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
		  this.prefixMentionLength = this.client.user.id.length + 3;
    } 
  
    async run(msg, [role]) {
      
      if (!msg.guild.configs.roles.public.length) return msg.send('No public roles configured in this guild.') 
      
      if (!role || msg.flags.list) {
        const roles = msg.guild.configs.roles.public;
        const mesg = [];
        for (let i = 0; i < Math.min(roles.length, 20); i++) {
          mesg.push(`${i + 1}.:: ${msg.guild.roles.get(roles[i]).name} (${roles[i]})`);
        }
        return msg.send([
          ` __**${msg.guild.name}'s Public Roles:**__ (Total ${roles.length} roles claimable)`,
          `${"```asciidoc\n"}${mesg.join("\n")}${"```"}`,
        ])
      } 
      
      if (role.size) role = role.first()
      if (!msg.guild.configs.roles.public.includes(role.id)) return msg.send('Invalid public role. Use this command without arguments to see a list of public roles.')
      
      const { regex: prefix, length: prefixLength } = this.getPrefix(msg) 
      const cmd = msg.content.slice(prefixLength).trim().split(' ')[0].toLowerCase()
      
      switch(cmd) {
          
          case "give":
            if (msg.member.roles.has(role.id)) return msg.errMsg('You already have that role.')
            return msg.member.roles.add(role)
              .then(() => msg.sendMessage(`Gave you role **${role.name}**`))
              .catch(() => null)
          
          case "take":
            if (!msg.member.roles.has(role.id)) return msg.errMsg('You don\'t have that role!') 
            return msg.member.roles.remove(role)
              .then(() => msg.sendMessage(`Took the role **${role.name}** from you.`))
              .catch(() => null)
          
          default: 
            if (msg.member.roles.has(role.id)) {
              return msg.member.roles.remove(role)
                .then(() => msg.sendMessage(`Took the role **${role.name}** from you.`))
                .catch(() => null)
            } else
              return msg.member.roles.add(role)
                .then(() => msg.sendMessage(`Gave you role **${role.name}**`)) 
                .catch(() => null)
      } 
    }
  
    getPrefix(msg) {
    if (this.prefixMention.test(msg.content)) return { length: this.nick.test(msg.content) ? this.prefixMentionLength + 1 : this.prefixMentionLength, regex: this.prefixMention };
		const prefix = msg.guildConfigs.prefix || this.client.config.prefix;
		if (Array.isArray(prefix)) {
			for (let i = prefix.length - 1; i >= 0; i--) {
				const testingPrefix = this.prefixes.get(prefix[i]) || this.generateNewPrefix(prefix[i]);
				if (testingPrefix.regex.test(msg.content)) return testingPrefix;
			}
		} else if (prefix) {
			const testingPrefix = this.prefixes.get(prefix) || this.generateNewPrefix(prefix);
			if (testingPrefix.regex.test(msg.content)) return testingPrefix;
		}
		return false;
    }
  
   generateNewPrefix(prefix) {
    const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject
   } 
} 