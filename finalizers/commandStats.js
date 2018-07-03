const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	async run(message) {
		if (!this.client.health.commands.has(message.command.name)) {
			this.client.health.commands.set(message.command.name, { count: 0 });
		}
		const cmd = this.client.health.commands.get(message.command.name);
		cmd.count++;
	}

};
