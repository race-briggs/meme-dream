'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const faker = require("faker");

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server.js');
const {MemeEntry} = require('../models.js');
const {TEST_DATABASE_URL} = require('../config.js');

chai.use(chaiHttp);

function seedMemeData(){
	console.info('seeding test database');
	let seedData = [];
	for(let i = 0; i < 10; i++){
		seedData.push(generateMemeData());
	};
	return MemeEntry.insertMany(seedData);
};

function generateMemeData(){
	return {
		name: faker.name.firstName(),
		type: faker.lorem.word(),
		origin: faker.lorem.word()
	};
};

function tearDown(){
	console.warn('tearing down database');
	return mongoose.connection.dropDatabase();
}

describe("basic test function", function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedMemeData();
	});

	after(function(){
		return closeServer();
	});

	afterEach(function(){
		return tearDown();
	})

	it('should give me a 200 status at the URL', function(){
		let res;
		return chai.request(app)
			.get('/memes')
			.then(_res => {
				res = _res;
				expect(res).to.have.status(200);
			});
	});
});