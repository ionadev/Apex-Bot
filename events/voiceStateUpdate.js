const { Event } = require('klasa');

module.exports = class extends Event {

	async run(oldMember, newMember) {
		setTimeout(async () => {
			const { player } = newMember.guild;
			if (!player.queue.length || !oldMember.guild.me.voiceChannel) return;
			setTimeout(async () => {
				if (oldMember.voiceChannel === oldMember.guild.me.voiceChannel &&
				newMember.voiceChannel !== newMember.guild.me.voiceChannel &&
				newMember.guild.me.voiceChannel.members.size === 1) {
					player.pause();
				}
				// 5 minute buffer to let people come back
			}, 1000 * 60 * 5);
		// 1 minute leverage
		}, 1000 * 60);
	}

};
