'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server.js');
//const {TEST_DATABASE_URL} = require('../config.js');

chai.use(chaiHttp);

describe("basic test function", function(){

	//before(function(){
	//	return runServer('http://localhost/meme-dream');
	//});

	//after(function(){
	//	return closeServer();
	//});

	it('should give me a 200 status at the URL', function(){
		return chai.request(app)
			.get('/')
			.then(res => {
				expect(res).to.have.status(200);
			});
	});
});