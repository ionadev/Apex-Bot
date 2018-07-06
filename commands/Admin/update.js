const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: 'Updates the bot from git.'
		});
	}

	async run(msg) {
		const { stderr, stdout } = await util.exec('git pull https://github.com/Soumil07/Apex-Bot.git');
		const output = [];
		if (stderr) output.push('ERROR', stderr);
		if (stdout) output.push('OUTPUT', stdout);
		return msg.sendMessage(util.codeBlock(undefined, output.join('\n')));
	}

};
