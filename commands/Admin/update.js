const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: 'Updates the bot from git.'
		});
	}

	async run(msg) {
		const { error, stderr, stdout } = await this.exec('git pull https://github.com/Soumil07/Apex-Bot.git');
		if (error) {
			await msg.send(`ERROR: ${util.codeBlock('', stderr)}`);
		} else {
			if (stdout.toString().toLowerCase().includes('Already up-to-date')) return msg.send('Repo already up to date.');
			await msg.send(`SUCCESS: ${util.codeBlock('', stdout)}`);
			return this.client.commands.get('reboot').run();
		}
		return null;
	}

	async exec(input) {
		const { stdout, stderr } = await util.exec(input);
		if (stderr) return { error: true, stderr };
		else return { error: false, stdout };
	}

};
