'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const faker = require("faker");
const bodyParser = require("body-parser");

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

	afterEach(function(){
			return tearDown();
		})

	after(function(){
		return closeServer();
	});

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
					console.log(memeEnt);
					expect(resMeme._id.toString()).to.equal(memeEnt._id.toString());
					expect(resMeme.name).to.equal(memeEnt.name);
					expect(resMeme.type).to.equal(memeEnt.type);
					expect(resMeme.origin).to.equal(memeEnt.origin);
				});
		});

	});

	describe('POST request', function(){

		it('should post a meme to the db', function(){

			let newMeme = generateMemeData();

			console.log(newMeme);

			return chai.request(app)
				.post('/memes')
				.send(newMeme)
				.then(function(res){
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys('name', 'type', 'origin');
					expect(res.body.name).to.equal(newMeme.name);
					expect(res.body.id).to.not.be.null;
					newMeme._id = res.body._id;
					return MemeEntry.findById(res.body._id);
				})
				.then(memeEnt => {
					expect(newMeme._id.toString()).to.equal(memeEnt._id.toString());
					expect(newMeme.name).to.equal(memeEnt.name);
					expect(newMeme.type).to.equal(memeEnt.type);
					expect(newMeme.origin).to.equal(memeEnt.origin);
				});
		});
	});

	describe('PUT request', function(){
		it('should update requested fields', function(){
			let updateData = {
				name: 'Krappa',
				type: 'emoticon'
			};

			return MemeEntry
				.findOne()
				.then(function(meme){
					console.log(meme)
					updateData._id = meme._id;
					console.log(updateData);
					return chai.request(app)
						.put(`/memes/${meme._id}`)
						.send(updateData)
				})
				.then(function(res){
					expect(res).to.have.status(204);

					return MemeEntry
						.findById(updateData._id);
				})
				.then(function(meme) {
					expect(meme.name).to.equal(updateData.name);
					expect(meme.type).to.equal(updateData.type);
				});
		});
	});


});