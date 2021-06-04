const {
	inputSendTextElemQuery,
	sendMsgButtonQuery,
	emojisButtonQuery,
	GIFButtonQuery,
	GIFsQuery
} = require('./constants');

const sendMessage = async (page, msg) => {
	await page.type(inputSendTextElemQuery, msg);
	await page.waitForTimeout(200);
	await page.click(sendMsgButtonQuery);
}

// Mmmm...... wassap does not support GIFs?¿
const sendGIF = async (page) => {
	await page.click(emojisButtonQuery);
	await page.waitForTimeout(500);

	await page.click(GIFButtonQuery);

	await page.waitForTimeout(1000);
	const GIFsUrls = await page.$$eval(GIFsQuery, (gifs) => {
		const regex = /(https)(\S+)(f)/gmi;
		let urlGifs = [];

		gifs.forEach((gif) => {
			// if we want more gifs, we need to scroll
			console.log(typeof(gif.innerHTML.match(regex)));
			if (gif.innerHTML.match(regex) != null)
				urlGifs.push(gif.innerHTML.match(regex));
		});

		console.log(urlGifs);
		return urlGifs;
	});

	let indexCont = Math.floor(Math.random() * ((GIFsUrls.length - 1) - 0) + 0);
	let indexGIF = Math.floor(Math.random() * ((GIFsUrls[indexCont].length - 1) - 0) + 0);
	await page.click(`[src="${GIFsUrls[indexCont][indexGIF]}"]`);
	console.log(GIFsUrls[indexCont][indexGIF]);
}

module.exports = { sendMessage, sendGIF };
