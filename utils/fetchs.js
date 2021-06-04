const axios = require('axios').default;

const fetchRandomQuotes = async (url) => {
	return axios(url)
		.then((response) => response.data)
		.catch((err) => console.error(err));
}

module.exports = { fetchRandomQuotes };
