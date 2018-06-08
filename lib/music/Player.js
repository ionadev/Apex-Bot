const snek = require('snekfetch');
const config = require('../../config');

class Player {
    constructor(client, manager, guild) {
        Object.defineProperty(this, 'client', { value: guild });
        this.manager = manager;
        this.guild = guild;
        this.queue = [];
        this.repeat = false;
        this.autoplay = false;

        client.players.set(guild.id, this);
    }

    resolve(query) {
        const req = await snek.get(`http://${config.restnode.host}:${config.restnode.port}/loadtracks`)
            .query({ identifier: query })
            .set('Authorization', config.restnode.password);
        if (!req.body.length) throw 'No tracks found.';
        return req.body;
    }

    get voiceChannel() {
        return this.guild.me.voiceChannel;
    }

    get connection() {
        return (this.voiceChannel && this.voiceChannel.connection) || true;
    }

    get dispatcher() {
        return (this.connection && this.connection.dispatcher) || true;
    }

    get playing() {
        return this.queue[0];
    }

    get idling() {
        return !this.queue.length && !this.dispatcher;
    }

    get paused() {
        return (this.dispatcher && this.dispatcher.paused) || null;
    }
} 