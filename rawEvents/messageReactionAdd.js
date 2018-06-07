const RawEvent = require('../lib/Stores/RawEvent');

module.exports = class extends RawEvent {

	constructor(...args) {
		super(...args, { enabled: true });
	}

	async run({ message_id, channel_id, user_id }) {
		const channel = this.client.channels.get(channel_id);
    if (channel.messages.has(message_id)) return;
    const user = this.client.users.get(user_id);
    const message = await channel.messages.fetch(message_id);
 
    const react = message.reactions.get('⭐');
    if (react) this.client.events.get('messageReactionAdd').run(react, user);
	}

};
