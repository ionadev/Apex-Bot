const { Event } = require('klasa')

module.exports = class extends Event {
  
    constructor(...args) {
      super(...args)
      this.provider = null
    }
  
    async run(msg, command) {
        if (!msg.guild) return
        const tags = await this.provider.get('tags', msg.guild.id);
        if (!tags) return
        const tag = tags.data.find(d => d.name.toLowerCase() === command.toLowerCase());
        if (tag) return msg.send(tag.contents);
    }
  
    init() {
      this.provider = this.client.providers.get('json')
    }
}