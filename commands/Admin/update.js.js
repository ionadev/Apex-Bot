const { Command, util } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            permissionLevel: 10,
            description: 'Updates the bot from gitlab.',
        });
    }

    async run(message) {
            const { stdout, stderr } = util.exec('git pull https://gitlab.com/stitch07/apex-bot');
            if (err) return console.error(err);
            const out = [];
            if (stdout) out.push(stdout);
            if (stderr) out.push(stderr);
            await message.channel.send(out.join('---\n'), { code: true });
            if (!stdout.toString().includes('Already up-to-date.')) {
              this.client.commands.get('reboot').run(message);
            }
        }
};
