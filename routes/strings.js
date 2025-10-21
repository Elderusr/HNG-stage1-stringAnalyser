const express = require('express');
const {getString, createString, getFiltered, deleteString} = require('../controllers/stringController');
const nlpQuery = require('../middleware/nlpParser');
const router = express.Router();

router.get('/strings', getFiltered);
router.get('/strings/nlp', (req, res, next) => {
    const { query } = req.query;
    console.log('we are hitting this endpoint')
    if(!query || typeof query !== 'string') {
        const error = new Error('Query must be provided and must be a string');
		error.status = 400;
		return next(error);
    }

    try {
        const interpreted = nlpQuery(query);
        // Put parsed filters into req.query and delegate to controller filter handler
        req.query = { ...req.query, ...interpreted.parsed_filters };
        return getFiltered(req, res);
    } catch (err){
        console.error(err);
        res.status(422).json({error:'Could not process the natural language query'});
    }
});
router.get('/strings/:stringValue', getString);
router.delete('/strings/:stringValue', deleteString);
router.post('/strings', createString);


module.exports = router;
