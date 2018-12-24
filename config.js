'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/meme-dream';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-meme-dream';
exports.PORT = process.env.PORT || 27017