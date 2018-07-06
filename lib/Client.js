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
		this.idioticAPI = new IdioticApi(config.api_keys.idiotic_api, { dev: true });
		this.rawEvents = new RawEvents(this);
		this.registerStore(this.rawEvents);
		this.lavalink = null;
		this.queue = new Map();

		this.health = Object.seal({
			cpu: new Array(96).fill(0),
			prc: new Array(96).fill(0),
			ram: new Array(96).fill(0),
			cmd: new Array(96).fill(0)
		});
		this.usedCommands = new Collection();
	}

	updateStats() {
		const { heapTotal, heapUsed } = process.memoryUsage();
		const { loadavg } = require('os');

		this.health.cpu.shift();
		this.health.cpu.push(((loadavg()[0] * 10000) | 0) / 100);

		this.health.prc.shift();
		this.health.prc.push(((100 * (heapTotal / 1048576)) | 0) / 100);

		this.health.ram.shift();
		this.health.ram.push(((100 * (heapUsed / 1048576)) | 0) / 100);

		this.health.cmd.shift();
		this.health.cmd.push(0);
	}

}

module.exports = Apex;
