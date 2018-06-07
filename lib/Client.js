const { Client, PermissionLevels } = require('klasa');
const api = require('idiotic-api');
const config = require('../config');
const RawEvents = require('./Stores/RawEventStore');

const permLevels = new PermissionLevels()
	.add(0, () => true)
	.add(2, (client, msg) => msg.guild && msg.guild.configs.roles.mod && msg.member.roles.has(msg.guild.configs.roles.mod), { fetch: true })
	.add(3, (client, msg) => msg.guild && msg.guild.configs.roles.admin && msg.member.roles.has(msg.guild.configs.roles.adminR), { fetch: true })
	.add(4, (client, msg) => msg.guild && msg.member.permissions.has('ADMINISTRATOR'), { fetch: true })
	.add(8, (client, msg) => msg.author.id === '289877125182521365')
	.add(9, (client, msg) => msg.author === client.owner, { break: true })
	.add(10, (client, msg) => msg.author === client.owner);

class Apex extends Client {

	constructor() {
		super({
			commandEditing: true,
			commandLogging: true,
			customPromptDefaults: {
				promptLimit: 5,
				quotedStringSupport: true
			},
			permissionLevels: permLevels,
			pieceDefaults: { commands: { deletable: true, promptTime: 30000, promptLimit: 5 } },
			prefix: config.PRODUCTION ? config.PRODUCTIONPREFIX : config.DEVPREFIX,
			typing: config.TYPING
		});

		this.methods = { Embed: require('discord.js').MessageEmbed };
		this.commandsUsed = 0;
		this.idioticAPI = new api.Client(config.api_keys.idiotic_api, { dev: true });
		this.rawEvents = new RawEvents(this);
		this.registerStore(this.rawEvents);
	}

}

module.exports = Apex;
