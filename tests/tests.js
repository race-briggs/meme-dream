'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const {app} = require('../server');
const {TEST_DATABASE_URL, PORT} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe("basic test function", function(){

	before(function(){
		mongoose.connect(TEST_DATABASE_URL, PORT);
	});

	after(function(){
		mongoose.disconnect(TEST_DATABASE_URL, PORT);
	});

	it('should give me a 200 status at the URL', function(){
		return chai.request(app)
			.get('/')
			.then(res => {
				expect(res).to.have.status(200);
			});
	});
});