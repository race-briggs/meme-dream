'use strict';
const express = require('express');
const router = express.Router();

const {MemeEntry} = require('./models');

router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
});

router.get('/', (req, res) => {
	MemeEntry.find()
		.then(memes => {
			res.json(memes);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error'});
		});
});

router.get('/:id', (req, res) => {
	MemeEntry.findById(req.params.id)
		.then(meme => {
			return res.json(meme);
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

router.get('/search/:name', (req, res) => {
	console.log(req.params.name);
	MemeEntry.findOne({name: req.params.name})
		.then(meme => {
			return res.json(meme);
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

router.post('/', (req, res) => {
	const requiredFields = ['name', 'type', 'origin', 'example'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	return MemeEntry.create({
		name: req.body.name,
		type: req.body.type,
		origin: req.body.origin,
		example: req.body.example
	})
		.then(meme => {
			return res.status(201).json(meme);
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

router.put('/:id', (req, res) => {
	if(!(req.params.id && req.body.id === req.body.id)){
		res.status(400).json({message: 'Request path id and request body id must be the same'});
	};

	const updated = {};
	const updateableFields = ['name', 'type', 'origin', 'example'];

	updateableFields.forEach(field => {
		if(field in req.body){
			updated[field] = req.body[field];
		}
	});

	MemeEntry.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.then(updatedMeme => {
			res.status(204).end();
		})
		.catch(err => {
			res.status(500).json({error: 'Internal server error'});
		});
});

router.put('/:name', (req, res) => {
	if(!(req.params.name && req.body.name === req.body.name)){
		res.status(400).json({message: 'Request path id and request body id must be the same'});
	};

	const updated = {};
	const updateableFields = ['name', 'type', 'origin', 'example'];

	updateableFields.forEach(field => {
		if(field in req.body){
			updated[field] = req.body[field];
		}
	});

	MemeEntry.findOneAndUpdate({name: req.params.name}, {$set: updated}, {new: true})
		.then(updatedMeme => {
			res.status(204).end();
		})
		.catch(err => {
			res.status(500).json({error: 'Internal server error'});
		});
});

router.delete('/:id', (req, res) => {
	return MemeEntry.findByIdAndRemove(req.params.id)
		.then(() => {
			console.log('deleting entry...');
			return res.status(204).end();
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

module.exports = router;