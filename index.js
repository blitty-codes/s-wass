const puppeteer = require('puppeteer');
const readline = require('readline');
const axios = require('axios').default;

const inputSendTextElemQuery = '._3uxr9 > .vR1LG._3wXwX.copyable-area > ._2A8P4 > ._1JAUF._2x4bz > ._2_1wd.copyable-text.selectable-text';
const inputSearchUserName = '._3LX7r > .RPX_m > ._1JAUF._1d1OL > ._2_1wd.copyable-text.selectable-text';
const sendMsgButtonQuery = '._3uxr9 > .vR1LG._3wXwX.copyable-area > .EBaI7 > ._1E0Oz';

const askQuestion = (query) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	
	return new Promise(resolve => rl.question(query, ans => {
		rl.close();
		resolve(ans);
	}))
}

const fetchRandomQuotes = async (url) => {
	return axios(url)
	.then((response) => response.data)
	.catch((err) => console.error(err));
}

const sendMessage = async (page, msg) => {
	await page.type(inputSendTextElemQuery, msg);
	await page.waitForTimeout(200);
	await page.click(sendMsgButtonQuery);
}

(async () => {
	let msg = '', numTimes = 10, option;
	
	try {
		
		const quotes = await fetchRandomQuotes('https://raw.githubusercontent.com/bitgary/hola-mundo/master/citas.json');
		const bw = await puppeteer.launch({ headless: false });
		const wass = await bw.newPage();
		
		// console.log(quotes);

		await wass.goto('https://web.whatsapp.com');
		
		await wass.waitForSelector(
			inputSearchUserName,
      { timeout: 0 }
		);
		
		const userName = await askQuestion("User (name in wassap): ");
		console.log(`Searching for ${userName}... (remmember link your wassap account!!)`);
		
		await wass.type(inputSearchUserName, `${userName}`, { delay: 10 });

		await wass.click(`[title="${userName}"]`);

		await wass.waitForSelector(
			inputSendTextElemQuery,
			oprions = { timeout: 3000 }
		);

		do {
			option = await askQuestion('\nMenu:\n\t1. Send a message X times.\n\t2. Send a random quote.\n\t3. Inspirational Quote\n\t0. exit\n\nOption: ');

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

			} else
				bw.close();
h		} while (option !== '0');

	} catch (e) {
		console.error(e);
	}

})();

