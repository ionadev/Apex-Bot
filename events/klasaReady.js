const { Event } = require.main.exports;

module.exports = class extends Event {

	async run() {
		await this.client.schedule.create('sweeper', '*/10 * * * *');
		await this.client.schedule.create('backup', '0 0 * * sun');
	}

};
