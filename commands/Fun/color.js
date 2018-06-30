const { Command } = require('klasa');
const { createCanvas } = require('canvas');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: 'Outputs the chosen color from hex.',
			extendedHelp: [
				'Flags',
				'--random: Shows a random color.'
			].join('\n'),

			usage: '[color:str]',
			usageDelim: ''
		});
	}

	async run(msg, [hexCode]) {
		if ('random' in msg.flags) {
			const { canvas, hex, rgb, dec } = this.random();
			return msg.channel.sendFile(canvas, `${hex}.png`, `Hex: ${hex}\nRGB: ${rgb}\nBase 10 Dec: ${dec}`);
		} else if ('rgb' in msg.flags) {
			const { r, g, b } = hexToRGB(msg.flags.rgb);
			return msg.send(`R: ${r} G: ${g} B: ${b}`);
		} else if ('binary' in msg.flags) {
			return msg.send(`Hexadeximal to binary: **${bin2Hex(hexCode)}**`);
		} else if ('decimal' in msg.flags) {
			if (msg.flags.decimal !== 'decimal') { return msg.send(`Base 10 to Hexadecimal: ${decimalToHex(msg.flags.decimal)}`); }
		} else {
			const validHex = /#?(\w{6})/i.test(hexCode);
			if (!validHex) throw 'Invalid hexcode.';
			const { canvas, hex } = this.draw(hexCode);
			return msg.channel.sendFile(canvas, `${hex}.png`);
		}
	}

	random() {
		var chars = '0123456789ABCDEF'.split('');
		var hex = '#';
		for (var i = 0; i < 6; i++) {
			hex += chars[Math.floor(Math.random() * 16)];
		}

		return this.draw(hex);
	}

	draw(hex) {
		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext('2d');
		if (hex.startsWith('#') === false) hex = `#${hex}`;
		ctx.fillStyle = hex;
		ctx.fillRect(0, 0, 250, 250);
		const rgb = hexToRGB(hex);
		const rgbString = `R: ${rgb.r} G: ${rgb.g} B: ${rgb.b}`;
		const dec = hexToDec(hex);

		return { canvas: canvas.toBuffer(), hex, rgb: rgbString, dec };
	}

};

const hexToRGB = hex => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
};

const decimalToHex = (d) => {
	var hex = Number(d).toString(16);
	hex = '000000'.substr(0, 6 - hex.length) + hex;
	return hex;
};

const hexToDec = hex => parseInt(hex.slice(1), 16);

const bin2Hex = bin => parseInt(bin, 2).toString(16);
