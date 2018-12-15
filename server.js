const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const {DATABASE_URL, PORT} = require('/config');


const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.listen(process.env.PORT || 8080);

app.get('/', (req, res) => {
	res.status(200);
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
					return  reject(err);
				}
				resolve();
			});
		});
	});
};

module.exports = {app, runServer, closeServer};