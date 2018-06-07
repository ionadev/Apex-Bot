const Apex = require('./lib/Client');
require('./lib/extensions/ApexGuild');
require('./lib/extensions/ApexChannel');
const klasa = require('klasa');

// initialize our client
new Apex().login(require('./config').TOKEN).catch(console.error);

module.exports = {

	// Export everything from Klasa
	...klasa
};
