require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.Promise = global.Promise;


const {DATABASE_URL, PORT} = require('./config');
const memeRoutes = require('./router');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use("/memes", memeRoutes);

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