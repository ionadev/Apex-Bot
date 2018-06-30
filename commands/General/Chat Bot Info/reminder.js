const { Command, Duration, util: { codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'creates a reminder',
			aliases: ['remind', 'reminder'],
			usage: '[text:str] [when:time]',
			usageDelim: 'in'
		});
	}

	async run(msg, [text, when]) {
		if (msg.flags.list) {
			const reminders = this.client.schedule.tasks.filter(task => task.taskName === 'reminder' && task.data.user === msg.author.id);
			if (!reminders.length) throw 'You have no pending reminders currently.';

			const send = reminders.map((reminder, i) => `[${i + 1}] ${reminder.id} :: ${reminder.data.text ? reminder.data.text.substr(0, 15) : 'No text'}`);

			return msg.send(`**Your reminders**: ${codeBlock('asciidoc', send.join('\n'))}`);
		}

		if (msg.flags.delete) {
			const toDelete = this.client.schedule.get(msg.flags.delete);
			if (!toDelete) throw 'This reminder ID does not exist.';
			if (toDelete.data.user !== msg.author.id) throw 'You can only delete your own reminders.';
			await this.client.schedule.delete(msg.flags.delete);
			return msg.send('Succesfully deleted the reminder.');
		}

		if (msg.flags.when) {
			const idOrNumber = Number.isInteger(Number(msg.flags.when));
			if (idOrNumber === false) throw 'The reminder number must be a valid number.';
			const reminder = this.client.schedule.tasks.filter(task => task.taskName === 'reminder' && task.data.user === msg.author.id)[Number(msg.flags.when) - 1];
			return msg.sendMessage(`Your reminder number ${msg.flags.when} expires in ${Duration.toNow(reminder.time)}`);
		}

		if (msg.flags.clear) {
			const reminders = this.client.schedule.tasks.filter(task => task.taskName === 'reminder' && task.data.user === msg.author.id);
			if (!reminders.length) throw 'You have no reminders.';

			await Promise.all(reminders.map(reminder => reminder.delete()));
			return msg.send(`Deleted ${reminders.length} reminders. 👌`);
		}

		if (!when || !text) throw 'You must specify a time and reminder.';
		if (when.getTime() - Date.now() < 60000) throw 'Reminders at least have to be one minute long.';

		const reminder = await this.client.schedule.create('reminder', when, {
			data: {
				channel: msg.channel.id,
				user: msg.author.id,
				text
			}
		});
		return msg.send(`Ok, I created you a reminder with the id: \`${reminder.id}\``);
	}

};
