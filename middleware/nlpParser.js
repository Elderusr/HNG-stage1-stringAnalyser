const nlp = require('compromise');

function parseNaturalLanguageQuery(query) {
	const filters = {};
	const doc = nlp(query.toLowerCase());

	//palindrome
	if (query.toLowerCase().includes('palindromic') || query.toLowerCase().includes('palindrome')) {
		filters.is_palindrome = true;
	}
	if (query.toLowerCase().includes('single word') || query.toLowerCase().includes('one word')) {
		filters.word_count= 1;
	}

	const longerThan = doc.match('longer than #value characters?');
	if (longerThan.found) {
		const num = longerThan.value().toNumber().numbers()[0];
		filters.min_length = parseInt(num) + 1;
	}
	const shorterThan= doc.match('shorter than #value characters?');
	if (shorterThan.found) {
		const num = shorterThan.value().toNumber().numbers()[0];
		filters.max_length= parseInt(num) - 1;
	}
	const containsLetters = doc.match('contain[s]? the letter #Letter');
	if (containsLetters.found) {
		const Letter = containsLetters.termList()[containsLetters.termList().length - 1]?.text;
		filters.contains_character = Letter;
	}

	return {
		original: query,
		parsed_filters: filters,
	};
	
}


module.exports = parseNaturalLanguageQuery;
