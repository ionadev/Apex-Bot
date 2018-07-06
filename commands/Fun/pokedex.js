const snek = require('snekfetch');
const HTMLParser = require('fast-html-parser');
const Entities = require('html-entities').AllHtmlEntities; // Used to decode the HTML encoding of the trivia API
const entities = new Entities();
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Display informations about a Pokemon.',
			usage: '<Pokemon:str>',
			botPerms: ['EMBED_LINKS'],
			cooldown: 10

		});
	}

	async run(message, [args]) {
		const poke = {};
		let res;

		res = await snek.get(`https://pokemondb.net/pokedex/${args.split(' ').join('-')}`).catch(() => null);
		if (!res) throw 'Invalid Pokemon.';
		const root = HTMLParser.parse(res.text);
		// raw
		const titleRaw = root.querySelector('title');
		const imgRaw = root.querySelector('.figure');
		const descR = root.querySelectorAll('table.vitals-table');
		const descR2 = descR[descR.length - 2].childNodes[0].childNodes;

		// data
		const pokeName = titleRaw.childNodes[0].rawText.split(' Pokédex')[0];
		const img = `https://img.pokemondb.net/artwork/${args.split(' ').join('-')}.jpg`;
		const description = descR2[descR2.length - 1].childNodes[3].childNodes[0].rawText;

		const data = root.querySelectorAll('.vitals-table');

		// pokedex data
		const dexNum = entities.decode(data[0].childNodes[1].childNodes[1].childNodes[3].childNodes[0].childNodes[0].rawText);
		const typeF = entities.decode(data[0].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0].rawText);
		const typeS = data[0].childNodes[1].childNodes[3].childNodes[3].childNodes[3] ?
			entities.decode(data[0].childNodes[1].childNodes[3].childNodes[3].childNodes[3].childNodes[0].rawText) : null;
		const species = entities.decode(data[0].childNodes[1].childNodes[5].childNodes[3].childNodes[0].rawText);
		const height = entities.decode(data[0].childNodes[1].childNodes[7].childNodes[3].childNodes[0].rawText);
		const weight = entities.decode(data[0].childNodes[1].childNodes[9].childNodes[3].childNodes[0].rawText);
		const abilityF = entities.decode(data[0].childNodes[1].childNodes[11].childNodes[3].childNodes[0].rawText);
		const abilityS = data[0].childNodes[1].childNodes[11].childNodes[3].childNodes[2] ?
			entities.decode(data[0].childNodes[1].childNodes[11].childNodes[3].childNodes[2].rawText) : null;
		const abilityT = data[0].childNodes[1].childNodes[11].childNodes[3].childNodes[4] ?
			entities.decode(data[0].childNodes[1].childNodes[11].childNodes[3].childNodes[4].rawText) : null;
		let types = typeF;
		if (typeS) types += `, ${typeS}`;
		let abilities = abilityF;
		if (abilityS) abilities += `, ${abilityS}`;
		if (abilityT) abilities += `, ${abilityT}`;

		// Training
		const EVs = entities.decode(data[1].childNodes[1].childNodes[1].childNodes[3].childNodes[0].rawText).replace(/\n/gi, '');
		// return console.log(EV)
		const catchR1 = entities.decode(data[1].childNodes[1].childNodes[3].childNodes[3].childNodes[0].rawText);
		const catchR2 = data[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1] ? entities.decode(data[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0].rawText) : null;
		const baseH1 = entities.decode(data[1].childNodes[1].childNodes[5].childNodes[3].childNodes[0].rawText);
		const baseH2 = data[1].childNodes[1].childNodes[5].childNodes[3].childNodes[1] ? entities.decode(data[1].childNodes[1].childNodes[5].childNodes[3].childNodes[1].childNodes[0].rawText) : null;
		const BaseExp = entities.decode(data[1].childNodes[1].childNodes[7].childNodes[3].childNodes[0].rawText);
		const growthR = entities.decode(data[1].childNodes[1].childNodes[9].childNodes[3].childNodes[0].rawText);

		// breeding
		const eggG1 = data[2].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[0].rawText;
		const eggG2 = data[2].childNodes[1].childNodes[1].childNodes[3].childNodes[3] ? data[2].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[0].rawText : null;
		const genderM = data[2].childNodes[1].childNodes[3].childNodes[3].childNodes[0].childNodes ? data[2].childNodes[1].childNodes[3].childNodes[3].childNodes[0].childNodes[0].rawText : null;
		const genderF = data[2].childNodes[1].childNodes[3].childNodes[3].childNodes[2] ? data[2].childNodes[1].childNodes[3].childNodes[3].childNodes[2].childNodes[0].rawText : null;
		const genderLess = data[2].childNodes[1].childNodes[3].childNodes[3].childNodes[0].rawText;
		const gender = genderM && genderF ? `${genderM} ${genderF}` : genderLess;
		const eggCycle = data[2].childNodes[1].childNodes[5].childNodes[3].childNodes[0].rawText;
		const eggStep = data[2].childNodes[1].childNodes[5].childNodes[3].childNodes[1].childNodes[0].rawText;

		// return console.log(eggCycle, eggStep)
		const eggs = `${eggG1}${eggG2 ? `, ${eggG2}` : ''}`;
		// return console.log(eggs)

		// adding things to it
		poke.index = dexNum;
		poke.name = pokeName;
		poke.image = img;
		poke.description = description;
		poke.types = [];
		poke.types.push(typeF);
		if (typeS) poke.types.push(typeS);
		poke.species = species;
		poke.height = height;
		poke.weight = weight;
		poke.abilities = [];
		poke.abilities.push(abilityF);
		if (abilityS) poke.abilities.push(abilityS);
		if (abilityT) poke.abilities.push(abilityT);
		poke.EV = EVs;
		poke.catchRate = `${catchR1}${catchR2 || ''}`;
		poke.happiness = `${baseH1}${baseH2 || ''}`;
		poke.baseExp = BaseExp;
		poke.growthRate = growthR;
		poke.eggGroup = [];
		poke.eggGroup.push(eggG1);
		if (eggG2) poke.eggGroup.push(eggG2);
		poke.gender = gender;
		poke.eggCycle = `${eggCycle} ${eggStep}`;

		// console.log(poke)
		// this.client.pokedex.set(poke.name.toLowerCase(), poke)
		// this.client.pokedex.set(parseInt(poke.index), poke)
		// var clean = await this.client.clean(this.client, poke);
		// return message.channel.send(`\`\`\`js\n${clean}\`\`\``).catch(e => console.log(e))
		// making the embed to send.
		const embed = new this.client.methods.Embed()
			.setTitle(pokeName)
			.setThumbnail(img)
			.setURL(`https://pokemondb.net/pokedex/${pokeName.replace(/ /gi, '-')}`)
			.setDescription(description)
			.addField('Type(s)', types, true)
			.addField('Species', species, true)
			.addField('Height', height, true)
			.addField('Weight', weight, true)
			.addField('Abilities', abilities, true)
			.addField('EV', EVs)
			.setFooter(`#${dexNum}`)
			.setColor('RANDOM');

		return message.send({ embed });
	}

};

