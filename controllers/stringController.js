const crypto = require('crypto');

const stringStore = new Map();

function computeSHA256(str) {
	return crypto.createHash('sha256').update(str).digest('hex');
};

function isPalindrome(str) {
	//Edge case: empty string
	if(str === "") {
		return true;
	};
	// Edge Case: single character
	if(str.length === 1) {
		return true;
	};

	//Clean string
	str = str.toLowerCase().replace(/[^A-Za-z0-9_]/g, "");
	const reversed = str.split('').reverse().join('');
	return str === reversed ? true : false;
};

function characterFrequencyMap(str) {
	const map = {};
	for (const char of str) {
		map[char] = (map[char] || 0) + 1;
	}
	return map;
};

const getString = (req, res) => {
  const {stringValue} = req.params;
  console.log(req.body);
	if (typeof stringValue !== 'string') {
		return res.status(422).json({ error: 'Invalid string value.'});
  }

	const hash = computeSHA256(stringValue);

	const data = stringStore.get(hash);
	if (!data) {
		return res.status(404).json({ error: 'String not found in the system'});
	}

	return res.status(200).json(data);
};

const getFiltered = (req, res) => {
	const {
		is_palindrome,
		min_length,
		max_length,
		word_count,
		contains_character
	 } = req.query;

	const filters = {};
	const errors = [];

	if (is_palindrome !== undefined) {
		if (is_palindrome === 'true' || is_palindrome === 'false') {
			filters.is_palindrome = is_palindrome === 'true';
		} else {
			errors.push('Invalid value for is_palindrom');
		}	
	}

	if (min_length !== undefined) {
		const val = parseInt(min_length);
		if (!isNaN(val)) {
			filters.min_length = val;
		} else {
			errors.push('min_length must be an integer');
		}
	}
	if (max_length !== undefined) {
		const val = parseInt(max_length);
		if (!isNaN(val)) {
			filters.max_length= val;
		} else {
			errors.push('max_length must be an integer');
		}
	}
	if (word_count !== undefined) {
		const val = parseInt(word_count);
		if (!isNaN(val)) {
			filters.word_count = val;
		} else {
			errors.push('word_count must be an integer');
		}
	}

	if (contains_character !== undefined) {
		if (contains_character.length === 1) {
			filters.contains_character = contains_character;
		} else {
			errors.push('contains_character must be a single character');
		}
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

    const allData = Array.from(stringStore.values());
    const filteredData = allData.filter(item => {
        if (filters.is_palindrome !== undefined && item.properties.is_palindrome !== filters.is_palindrome) {
            return false;
        }
        if (filters.min_length !== undefined && item.properties.length < filters.min_length) {
            return false;
        }
        if (filters.max_length !== undefined && item.properties.length > filters.max_length) {
            return false;
        }
        if (filters.word_count !== undefined && item.properties.word_count !== filters.word_count) {
            return false;
        }
        if (filters.contains_character !== undefined && !item.value.includes(filters.contains_character)) {
            return false;
        }
        return true;
    });

    res.status(200).json({
        data: filteredData,
        count: filteredData.length,
        filters_applied: filters
    });
};

const createString = (req, res, next) => {
	const { value } = req.body;

	if (value === undefined) {
		const error = new Error('Missing "value" field in request body.');
		error.status = 400;
		return next(error);
	}
	if (typeof value !== 'string') {
		const error = new Error('"value" must be a string');
		error.status = 422;
		return next(error);
	}

	const hash = computeSHA256(value);

	if (stringStore.has(hash)) {
		const error = new Error('String already exists in system');
		error.status = 409;
		return next(error);
	}

	const analyzed = {
		id: hash,
		value,
			properties: {
				length: value.length,
				is_palindrome: isPalindrome(value),
				unique_characters: new Set(value).size,
				word_count: value.trim().split(/\s+/).length,
				sha254_hash: hash,
				character_frequency_map: characterFrequencyMap(value),
			},
		created_at: new Date().toISOString()
	};

	stringStore.set(hash, analyzed);
	return res.status(201).json(analyzed);
};

const deleteString = (req, res, next) => {
    const { stringValue } = req.params;
    if (typeof stringValue !== 'string') {
        return res.status(422).json({ error: 'Invalid string value.' });
    }

    const hash = computeSHA256(stringValue);

    if (!stringStore.has(hash)) {
        return res.status(404).json({ error: 'String does not exist in the system' });
    }

    stringStore.delete(hash);
    return res.status(200).send();
};

module.exports =  {createString, getString, getFiltered, deleteString};
