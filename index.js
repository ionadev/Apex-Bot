const config = require('./config');
const { ShardingManager } = require('discord.js');
const Logger = require('./modules/Logger');

const manager = new ShardingManager('./apex', {
	totalShards: 'auto',
	respawn: true,
	token: config.TOKEN
});

manager.spawn(manager.totalShards);
manager.on('shardCreate', shard => {
	Logger.send('Master', `Spawning shard ${shard.id}.`);
});
