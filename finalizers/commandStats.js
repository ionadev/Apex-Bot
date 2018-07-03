const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	async run(message) {
		this.client.health.cmd[95]++;
		if (!this.client.usedCommands.has(message.command.name)) {
			this.client.usedCommands.set(message.command.name, { count: 0 });
		}
		this.client.usedCommands.get(message.command.name).count++;
	}

};
