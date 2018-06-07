const { Command } = require('klasa')
const request = require("snekfetch");
const Entities = require("html-entities").AllHtmlEntities;
// Used to decode the HTML encoding of the trivia API
const entities = new Entities();

const gameStatus = new Set()

module.exports = class extends Command {
  
    constructor(...args) {
        super(...args, {
          description: 'Play a game of trivia.',
          cooldown: 15,
          usageDelim: ' ',
          usage: '[general|books|film|music|theatres|tv|videogames|boardgames|nature|computers|maths|mythology|sports|geography|history|politics|art|celebrities|animals|vehicles|comics|gadgets|manga|cartoon] [boolean|multiple] [duration:int]',
        })
    } 
  
    async run(msg, [category, type, duration]) {
      var reply; 
  reply = await msg.channel.send(`\`\`\`Searching for a random trivia (this can take a few seconds)\`\`\``);
	
	// Check Game Status
	if (gameStatus.has(msg.channel.id)) {
		return reply.edit(`\`\`\`A game of trivia is already going on in this channel. Please wait until it's over before starting a new one.\`\`\``);
	} else {
		gameStatus.add(msg.channel.id);
	}

	// Duration
	if (duration) {
		if (duration < 30 || duration > 60) {
			return reply.edit(`\`\`\`The duration cannot be \`${duration}\`. It must be in between 30 and 60.\nPlease try again.\`\`\``);
		} else {
			var time = duration * 1000;
		}
	} else {
		var time = 30000;
	}

	// category
	let categoryReq = "&category=";
	if (category != null) {
		switch (category.toLowerCase()) {
	    case "general":
	      categoryReq += 9;
	      break; 
	    case "books":
	      categoryReq += 10;
	      break; 
	    case "film":
	      categoryReq += 11;
	      break; 
	    case "music":
	      categoryReq += 12;
	      break; 
	    case "theatres":
	      categoryReq += 13;
	      break; 
	    case "tv":
	      categoryReq += 14;
	      break; 
	    case "videogames":
	      categoryReq += 15;
	      break; 
	    case "boardgames":
	      categoryReq += 16;
	      break; 
	    case "nature":
	      categoryReq += 17;
	      break; 
	    case "computers":
	      categoryReq += 18;
	      break; 
	    case "maths":
	      categoryReq += 19;
	      break; 
	    case "mythology":
	      categoryReq += 20;
	      break; 
	    case "sports":
	      categoryReq += 21;
	      break; 
	    case "geography":
	      categoryReq += 22;
	      break; 
	    case "history":
	      categoryReq += 23;
	      break; 
	    case "politics":
	      categoryReq += 24;
	      break; 
	    case "art":
	      categoryReq += 25;
	      break; 
	    case "celebrities":
	      categoryReq += 26;
	      break; 
	    case "animals":
	      categoryReq += 27;
	      break; 
	    case "vehicles":
	      categoryReq += 28;
	      break; 
	    case "comics":
	      categoryReq += 29;
	      break; 
	    case "gadgets":
	      categoryReq += 30;
	      break; 
	    case "manga":
	      categoryReq += 31;
	      break; 
	    case "cartoon":
	      categoryReq += 32;
	      break; 
	    default: 
	      categoryReq = "";
		}
	} else {
		categoryReq = "";
	}

	// Type (boolean or multiple)
	let typeReq = "&type="
	if (type != null) {
		switch (type.toLowerCase()) {
	    case "boolean":
	      typeReq += type.toLowerCase();
	      break; 
	    case "multiple":
	      typeReq += type.toLowerCase();
	      break; 
	    default: 
	      typeReq = "";
	  }
	} else {
		typeReq = "";
	}

	/* Trivia */
  // Variables
  var category, difficulty, question, question_type, question_display, correct_answer;
  var incorrect_answers = [], possible_answers = [];
  var displayed_answers = "";
  // Request
  var url = `https://opentdb.com/api.php?amount=1${categoryReq}${typeReq}`;
  console.log(url);
  var req = await request.get(url).then(data => JSON.parse(data.text));
  if(!req || !req.results || req.results.length === 0){
    console.log(req);
    reply.edit("```Error:\n" + JSON.stringify(req) + "```");
    gameStatus.delete(msg.channel.id);
    return;
  }
  category = req.results[0].category;
  correct_answer = req.results[0].correct_answer;
  incorrect_answers = req.results[0].incorrect_answers;
  difficulty = req.results[0].difficulty;
  question = req.results[0].question;
  question_type = req.results[0].type;

  // Checks wether the question is boolean or not
  if (question_type == "boolean") {
  	possible_answers.push(incorrect_answers[0].toLowerCase());
  	possible_answers.push(correct_answer.toLowerCase());
  	question_display = `*Difficulty: ${difficulty}*\n\n**True or false?**\n${entities.decode(question)}`;
  } else {
  	for (var i = 0; i < incorrect_answers.length; i++) {
  		possible_answers.push(incorrect_answers[i]);
  	}
  	possible_answers.push(correct_answer);
  	possible_answers = shuffleArray(possible_answers);
  	for(var i = 0; i < possible_answers.length; i++){
  		displayed_answers += `***${i+1}.** ${possible_answers[i]}*\n`;
  		possible_answers[i] = possible_answers[i].toLowerCase(); // Lower case so the message collector doesn't have to do it
  	}
  	question_display = `**Difficulty: ${difficulty}**\n\n${entities.decode(question)}\n\n${entities.decode(displayed_answers)}`;
  }

  /* Result */
  const embed = new this.client.methods.Embed()
    .setAuthor("Trivia")
    .setTitle(category)
    .setColor(0xf37917)
    .setThumbnail("http://i.imgur.com/zPtu5aP.png")
    .setFooter("Please write the whole answer")
    .setDescription(`\n_${question_display}_\n\n`);

  await reply.edit({embed});

	// Create a message collector
	var participants = [];
	var winner = "";
	const collector = msg.channel.createMessageCollector(
	  answer => possible_answers.includes(answer.content.toLowerCase()),
	  { time: time }
	);
	collector.on('collect', answer => {
		if (answer.content.toLowerCase() === correct_answer.toLowerCase() && !participants.includes(answer.author.id)) {
			gameStatus.delete(msg.channel.id); // Closes the game
			winner = answer.author;
			collector.stop(); // Closes the collector 
		} else if (!participants.includes(answer.author.id)) {
			participants.push(answer.author.id);
			msg.channel.send(`**${answer.content}** is not the correct answer. Better luck next time!`);
		} else {
			msg.channel.send(`${answer.author}, You already tried! Wait for another game to start before participating again!`);
		}
	});
	collector.on('end', collected => {
		if (winner.length == 0) { // Nobody found
			msg.channel.send(`Seems no one got it! The right answer was **${entities.decode(correct_answer)}**`);
		} else { // We have a winner
			msg.channel.send(`We have a winner! ${winner} had a right answer with **${entities.decode(correct_answer)}**!`);
			winner = ""; // Clear the winner
		}
		// Clear the participants
		for (var i = participants.length; i > 0; i--) { 
			participants.pop();
		}
		gameStatus.delete(msg.channel.id); // Closes the game
		return;
	});
    } 

} 

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]]=[array[j], array[i]]            
  }
  return array;
} 