const { Command, util } = require('klasa');
const snek = require('snekfetch')
const Imgflipper = require('imgflipper')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 0,
			runIn: ['text'],

			description: 'Generate a meme using imgflip.',
			usage: '[memetype:str] <text1:str> [text2:str]',
			usageDelim: ','
		});
	}

	async run(msg, [memetype, text, text2]) {
    if (!Object.keys(meme).includes(memetype)) throw `Invalid meme type. Choose a valid option: ${util.codeBlock(Object.keys(meme).join(' | '))}`
    
    const imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password)
    imgflipper.generateMeme(meme[memetype], text, text2 ? text2 : '', (err, image) => {
      
      return msg.channel.sendFile(image)
    })
	}

};

const AuthDetails = {
  imgflip_username: "xSoumil",
  imgflip_password: "aeetes",
};

const meme = {
  brace: 61546,
  mostinteresting: 61532,
  fry: 61520,
  onedoesnot: 61579,
  yuno: 61527,
  success: 61544,
  allthethings: 61533,
  doge: 8072285,
  drevil: 40945639,
  skeptical: 101711,
  notime: 442575,
  yodawg: 101716,
  awkwardpenguin: 61584,
  grumpycat: 405658,
  wesmart: 89370399
};