require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
mongoose.Promise = global.Promise;


const {DATABASE_URL, PORT} = require('./config');
const {MemeEntry} = require('./models');


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

app.get('/memes', (req, res) => {
	MemeEntry.find()
		.then(memes => {
			res.json(memes);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error'});
		});
});

app.get('/memes/:id', (req, res) => {
	MemeEntry.findById(req.params.id)
		.then(meme => {
			res.json(meme);
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

app.post('/memes', (req, res) => {
	const requiredFields = ['name', 'type', 'origin'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	MemeEntry.create({
		name: req.body.name,
		type: req.body.type,
		origin: req.body.origin
	})
		.then(meme => res.status(201).json(meme))
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

app.put('/memes/:id', (req, res) => {
	if(!(req.params.id && req.body._id === req.body._id)){
		res.status(400).json({message: 'Request path id and request body id must be the same'});
	};

	const updated = {};
	const updateableFields = ['name', 'type', 'origin'];

	updateableFields.forEach(field => {
		if(field in req.body){
			updated[field] = req.body[field];
		}
	});

	console.log(updated);

	MemeEntry.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.then(updatedMeme => {
			console.log(updatedMeme);
			res.status(204).end();
		})
		.catch(err => {
			res.status(500).json({error: 'Internal server error'});
		});
});

app.delete('/memes/:id/', (req, res) => {
	MemeEntry.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).json({message: 'Item successfully deleted'})
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({error: 'Internal server error'});
		});
});

let server;

function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
};

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
};

if(require.main === module) {
	runServer(DATABASE_URL, PORT).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};