const { Store } = require('klasa');
const RawEvent = require('./RawEvent');

module.exports = class RawEventStore extends Store {

	constructor(client) {
		super(client, 'rawEvents', RawEvent);
	}

};
