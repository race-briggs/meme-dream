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

describe("meme-db app", function(){

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

	describe('GET request', function(){
		it('should return all existing memes', function(){
			let res;
			return chai.request(app)
				.get('/memes')
				.then(_res => {
					res = _res;
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.have.lengthOf.at.least(1);
					return MemeEntry.count();
				})
				.then(function(count){
					expect(res.body).to.have.lengthOf(count);
				});
		});
		it('should return a meme with correct fields', function(){
			let resMeme;
			return chai.request(app)
				.get('/memes')
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');
					res.body.forEach(function(memeEnt){
						expect(memeEnt).to.be.a('object');
						expect(memeEnt).to.include.keys('name', 'type', 'origin');
					});
					resMeme = res.body[0];
					console.log(resMeme);
					return MemeEntry.findById(resMeme._id);
				})
				.then(memeEnt => {
					expect(resMeme.id).to.equal(memeEnt.id);
					expect(resMeme.name).to.equal(memeEnt.name);
					expect(resMeme.type).to.equal(memeEnt.type);
					expect(resMeme.origin).to.equal(memeEnt.origin);
				});
		});
	});
});