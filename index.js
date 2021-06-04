const puppeteer = require('puppeteer');

const { askQuestion } = require('./utils/input');
const { fetchRandomQuotes } = require('./utils/fetchs');
const { sendMessage, sendGIF } = require('./utils/sends');

const { 
	inputSendTextElemQuery,
	inputSearchUserNameQuery,
} = require('./utils/constants');

(async () => {
	let msg = '', numTimes = 10, option;
	
	try {
		
		const quotes = await fetchRandomQuotes('https://raw.githubusercontent.com/bitgary/hola-mundo/master/citas.json');
		const bw = await puppeteer.launch({ headless: false });
		const wass = await bw.newPage();

		await wass.goto('https://web.whatsapp.com');
		
		await wass.waitForSelector(
			inputSearchUserNameQuery,
      { timeout: 0 }
		);
		
		const userName = await askQuestion("User (name in wassap): ");
		console.log(`Searching for ${userName}... (remmember link your wassap account!!)`);
		
		await wass.type(inputSearchUserNameQuery, `${userName}`, { delay: 10 });

		await wass.waitForSelector(`[title="${userName}"]`);
		await wass.click(`[title="${userName}"]`);

		await wass.waitForSelector(
			inputSendTextElemQuery,
			{ timeout: 3000 }
		);

		do {
			option = await askQuestion('\nMenu:\n\t1. Send a message X times.\n\t2. Send a random quote.\n\t3. Inspirational Quote\n\t4. Send a random GIF\n\t0. exit\n\nOption: ');

			if (option === '1') {
				numTimes = await askQuestion('How many times do you want to send the message? ')
				msg = await askQuestion(`What do you want to say to ${userName} ${numTimes} times? `);
				for (let i = 0; i < numTimes; i++)
					await sendMessage(wass, msg);

			} else if (option === '2') {
				let randomIndex = Math.floor(Math.random() * ((quotes.length - 1) - 0) + 0);
				await sendMessage(wass, `"${quotes[randomIndex].cita}" - ${quotes[randomIndex].autor}`);

			} else if (option === '3') {
				let quote = await fetchRandomQuotes('https://zenquotes.io/api/random')
														.then((response) => response)
														.catch(err => err);
				await sendMessage(wass, `"${quote[0].q}" - ${quote[0].a}`);
			
			} else if (option === '4') {
				await sendGIF(wass);
			} else
				bw.close();
		} while (option !== '0');

	} catch (e) {
		console.error(e);
	}

})();

