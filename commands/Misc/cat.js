const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['randomcat'],
            bucket: 2,
            botPerms: ['EMBED_LINKS'],
            cooldown: 5,
            description: 'Shows you a random cat.',
            extendedHelp: 'Powered by shibe.online',
        });

        this.API_URL = 'http://shibe.online/api/cats?count=1%22'
    }

    async run(msg) {
        const { body: [url] } = await snek.get(this.API_URL);
        return msg.sendEmbed(new this.client.methods.Embed()
            .setAuthor('Random cat')
            .setImage(url)
            .setFooter('Powered by shibe.online')
        );
    }
};
