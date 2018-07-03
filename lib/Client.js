const { Client, PermissionLevels } = require('klasa');
const { Collection } = require('discord.js');
const IdioticApi = require('./IdioticApiClient.js');
const config = require('../config');
const RawEvents = require('./Stores/RawEventStore');
const { PlayerManager } = require('discord.js-lavalink');

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
			providers: { default: 'rethinkdb' },
			prefix: config.PRODUCTION ? config.PRODUCTIONPREFIX : config.DEVPREFIX,
			typing: config.TYPING
		});

		this.methods = { Embed: require('discord.js').MessageEmbed };
		this.health = {
			commands: new Collection(),
			memory: new Collection()
		};
		this.idioticAPI = new IdioticApi(config.api_keys.idiotic_api, { dev: true });
		this.rawEvents = new RawEvents(this);
		this.registerStore(this.rawEvents);
		this._player = new PlayerManager(this, [{ host: 'localhost', port: 5200, password: 'owo_a_lavalink_server', region: 'us' }], {
			user: '336452165638029312',
			shards: 1
		});
	}

	updateMemory() {
		const ramUsed = process.memoryUsage().heapUsed / 1024 / 1024;
		this.health.memory.set(Date.now().toString('hex'), ramUsed);
		return setTimeout(this.updateMemory.bind(this), 1000 * 60);
	}

}

module.exports = Apex;
