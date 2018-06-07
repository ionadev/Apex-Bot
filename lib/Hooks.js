const { APIServer, json } = require('http-nextra');
const { Permissions } = require('discord.js');
const { Duration } = require('klasa');
const os = require('os');
const snekfetch = require('snekfetch');

class DashboardHooks extends APIServer {

	constructor(client, options = { port: 3000 }) {
		super();

		Object.defineProperty(this, 'client', { value: client });

		this.use(async (req, res, next) => {
			if (req.method !== 'OPTIONS') client.console.log(`PATH: ${req.path} - URL: ${req.url} - METHOD: ${req.method}`);
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
			if (req.method === 'OPTIONS') return res.status(200).send('You twat');
			if (req.method === 'POST') await json(req);
			next();
		});

		this.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Trident bot API' }));

		this.get('/stats', (req, res) => res.status(200).json({
			users: this.client.users.size,
			members: this.client.guilds.reduce((prev, guild) => prev + guild.memberCount, 0),
			guilds: this.client.guilds.size,
			channels: this.client.guilds.reduce((prev, guild) => prev + guild.channels.size, 0),
			cpu: Math.round(os.loadavg()[0] * 10000) / 100,
			memoryTotal: Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100,
			memoryUsed: Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100,
			uptime: {
				host: Duration.toNow(Date.now() - (os.uptime() * 1000)),
				process: Duration.toNow(Date.now() - (process.uptime() * 1000)),
				client: Duration.toNow(Date.now() - this.client.uptime)
			}
		}));

		this.get('/users', (req, res) => res.status(200).json([...client.users.keys()]));

		this.get('/users/:id', async (req, res, { id }) => {
			if (id === 'all') return res.status(200).json([...client.users.values()]);
			const user = await client.users.fetch(id).catch(() => null);
			if (!user) return res.status(400).json({ message: 'Could not find that user.' });
			return res.status(200).json(user.toJSON());
		});

		this.get('/guilds', (req, res) => res.status(200).json([...client.guilds.keys()]));

		this.get('/guilds/:id', (req, res, { id }) => {
			if (id === 'all') return res.status(200).json([...client.guilds.values()]);
			const guild = client.guilds.get(id);
			if (!guild) return res.status(400).json({ message: 'Could not find that guild.' });
			return res.status(200).json(guild.toJSON());
		});

		this.get('/guilds/:id/members', (req, res, { id }) => {
			const guild = client.guilds.get(id);
			if (!guild) return res.status(400).json({ message: 'Could not find that member' });
			return res.status(200).json([...guild.members.keys()]);
		});

		this.get('/guilds/:guildID/members/:memberID', async (req, res, { guildID, memberID }) => {
			const guild = client.guilds.get(guildID);
			if (!guild) return res.status(400).json({ message: 'Could not find that guild.' });
			if (memberID === 'all') return res.status(200).json([...guild.members.values()]);
			const member = await guild.members.fetch(memberID).catch(() => null);
			if (!member) return res.status(400).json({ message: 'Could not find that member' });
			return res.status(200).json(member.toJSON());
		});

		this.get('/guilds/:id/roles', (req, res, { id }) => {
			const guild = client.guilds.get(id);
			if (!guild) return res.status(400).json({ message: 'Could not find that guild.' });
			return res.status(200).json([...guild.roles.keys()]);
		});

		this.get('/guilds/:guildID/roles/:roleID', (req, res, { guildID, roleID }) => {
			const guild = client.guilds.get(guildID);
			if (!guild) return res.status(400).json({ message: 'Could not find that guild.' });
			if (roleID === 'all') return res.status(200).json([...guild.roles.values()]);
			const role = guild.roles.get(roleID);
			if (!role) return res.status(400).json({ message: 'Could not find that role' });
			return res.status(200).json(role.toJSON());
		});

		this.get('/guilds/:id/channels', (req, res, { id }) => {
			const guild = client.guilds.get(id);
			if (!guild) return res.status(400).json({ message: 'Could not find that guild.' });
			return res.status(200).json([...guild.channels.keys()]);
		});

		this.get('/guilds/:guildID/channels/:channelID', (req, res, { guildID, channelID }) => {
			const guild = client.guilds.get(guildID);
			if (!guild) return res.status(400).json({ message: 'Could not find that guild.' });
			if (channelID === 'all') return res.status(200).json([...guild.channels.values()]);
			const channel = guild.roles.get(channelID);
			if (!channel) return res.status(400).json({ message: 'Could not find that channel' });
			return res.status(200).json(channel.toJSON());
		});

		for (const [name, store] of client.pieceStores) this.get(`/${name}`, (req, res) => res.json([...store.values()]));

		const clientId = this.client.user.id;
		const clientSecret = 'Py4Fd2xD5hhXD3F12-bToFBs1pkGaPjN';

		this.post('/oauth/callback', async (req, res) => {
			if (!req.body.code) return res.status(400).json({ message: 'No code provided' });
			const creds = Buffer.from(`${clientId}:${clientSecret}`, 'binary').toString('base64');
			const response = await snekfetch.post(`https://discordapp.com/api/oauth2/token`)
				.set({ Authorization: `Basic ${creds}` })
				.query({
					grant_type: 'authorization_code',
					redirect_uri: req.body.redirectUri,
					code: req.body.code
				});
			if (!response) return res.status(500).json({ message: 'Error fetching token' });
			return res.status(200).json(response.body);
		});

		this.get('/oauth/user', async (req, res) => {
			const auth = req.get('Authorization');
			if (!auth) return res.status(401).json({ message: 'Unauthorized' });
			const { body: user } = await snekfetch.get('https://discordapp.com/api/users/@me')
				.set('Authorization', auth);
			return res.status(200).json(user);
		});

		this.get('/oauth/user/guilds', async (req, res) => {
			const auth = req.get('Authorization');
			if (!auth) return res.status(401).json({ message: 'Unauthorized' });
			const { body } = await snekfetch.get('https://discordapp.com/api/users/@me/guilds')
				.set('Authorization', auth);
			const guilds = body.filter(guild => new Permissions(guild.permissions).has('MANAGE_GUILD'));
			return res.status(200).json(guilds);
		});

		this.get('/settings/view/:guildID', async (req, res, { guildID }) => {
			const guild = client.guilds.get(guildID);
			if (!guild) return res.status(400).json({ message: 'Could not find guild' });
			return res.status(200).json(guild.configs);
		});

		this.listen(options.port, () => client.console.log(`Sucessfully started api on port ${options.port}`));
	}

	cors(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	}

}

module.exports = DashboardHooks;
