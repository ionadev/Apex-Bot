const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    constructor(...args) {
        super(...args, {
            enabled: true
        });
    }

    run(msg, mes, start) {
        this.client.commandsUsed++;
        this.client.pingArray.push(Math.round(this.client.ping))
    }

};
