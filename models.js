'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const memeEntrySchema = mongoose.Schema({
	name: {type: String, required: true},
	type: {type: String, required: true},
	origin: {type: String}
});

const MemeEntry = mongoose.model('Meme', memeEntrySchema);

module.exports = {MemeEntry};