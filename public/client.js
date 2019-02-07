'use strict';

const url = "https://sheltered-fortress-34693.herokuapp.com/memes";

let currentMemeId;

let callerFunction;

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function showSection(){
	$('.search-nav').click(function(){
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="search-form" method="get">
				<p>SEARCH FOR A MEME</p>
				<label class="meme-search" for="meme-search"> Search for a meme:
				<input class="search-txt" type="text" name="meme-search" placeholder="Meme name" required="true"></label>
				<input role="button" class="search-btn" type="submit" name="search-btn" value="Search">
			</form>`);
	});
	$('.submit-nav').click(function(){
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="submit-form" method="post">
				<p>SUBMIT A MEME</p>
				<label class="submit-label">Meme name:<input type="text" name="meme-name" class="meme-name" placeholder="Name" required="true"></label>
				<label class="submit-label">Meme type:<input type="text" name="meme-type" class="meme-type" placeholder="Type" required="true"></label>
				<label class="submit-label">Meme origin:<input type="text" name="meme-origin" class="meme-origin" placeholder="Origin" required="true"></label>
				<label class="submit-label">Example image:<input type="text" name="meme-example" class="meme-example" placeholder="Image url"></label>
				<input role="button" class="submit-btn" type="submit" name="submit-btn" value="Submit">
			</form>
			`);
	});
	$('.delete-nav').click(function(){
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="delete-form" method="delete">
				<p>DELETE A MEME</p>
				<label class="meme-delete" for="meme-delete"> Delete a meme by ID:
				<input class="delete-txt" type="text" name="meme-delete" placeholder="Enter a meme ID" required="true"></label>
				<input role="button" class="delete-btn" type="submit" name="search-btn" value="Delete">
			</form>
			`);
	});
	$('.update-nav').click(function(){

		let foundMeme = {};
		
		fetch(url + '/' + currentMemeId, {
			method: 'GET',
			headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		}})
		.then(response => response.json())
		.then(responseJson => {
			foundMeme.name = responseJson.name;
			foundMeme.origin = responseJson.origin;
			foundMeme.type = responseJson.type;
			foundMeme.example = responseJson.example;
			return foundMeme;
		})
		.then(meme => {
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="update-form" method="post">
				<p>UPDATE A MEME</p>
				<label class="submit-label">Meme ID:<input type="text" name="update-id" class="update-id" value="${currentMemeId}" required="true"></label>
				<label class="submit-label">Meme name:<input type="text" name="new-meme-name" class="new-meme-name" value="${meme.name}" required="true"></label>
				<label class="submit-label">Meme type:<input type="text" name="new-meme-type" class="new-meme-type" value="${meme.type}" required="true"></label>
				<label class="submit-label">Meme origin:<input type="text" name="new-meme-origin" class="new-meme-origin" value="${meme.origin}" required="true"></label>
				<label class="submit-label">Meme example: <input type="text" name="new-meme-example" class="new-meme-example" value="${meme.example}" required="true"></label>
				<input role="button" class="update-btn" type="submit" name="submit-btn" value="Submit">
			</form>
			`);
		});
	});
}

function getMemes(callbackFn){
	callerFunction = 'getMemes';
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
	}})
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error(respnose.statusText);
		})
		.then(responseJson => {
				setTimeout(function(){displayMemes(responseJson)}, 1)
		})
		.catch(err => {
			console.error(err);
		});

}

function getByName(name, callbackFn){

	callerFunction = 'getByName';

	let urlWithName = url + '/search/' + name;
	console.log(urlWithName);

		fetch(urlWithName, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
	}})
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then(responseJson => {
				setTimeout(function(){displayMemes(responseJson)}, 1)
		})
		.catch(err => {
			console.error(err);
		});
}

function deleteMeme(id){
	let urlWithId = url + '/' + id;

	return fetch(urlWithId, {
	method: 'delete'
	})
	.then(response => {
		console.log('hello!');
	$('.results-list').html(
		`<li><h3>Item successfully deleted.</h3></li>
		`);
	$('.forms-div').addClass('hidden');
	$('.results').removeClass('hidden');
	$('.reset-div').removeClass('hidden');
	
	})
	.catch(err => {
		console.error(err);
	});

}

function submitMeme(options){

	console.log(options);

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(options)
	})
	.then(response => response.json())
	.then(responseJson => {
		console.log('Submission successful');
		console.log(responseJson);
		$('.results-list').empty();
		$('.results-list').append(
			`<li class="result-li">
			<h3>${responseJson.name}</h3>
			<p class="get-separator">Origin: ${responseJson.origin}</p>
			<p class="get-separator">Type: ${responseJson.type}</p>
			<p class="get-separator"><a href="${responseJson.example}">${responseJson.example}</a></p>
			<p class="get-separator">ID: ${responseJson._id}</p>
			</li>`);
		$('.forms-div').addClass('hidden');
		$('.results').removeClass('hidden');
		$('.reset-div').removeClass('hidden');
	})
	.catch(err => {
		console.error(err);
	});
}

function updateMeme(options){

	let fullUrl = url + '/' + currentMemeId;

	fetch(fullUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(options)
	})
	.then(response => {
		console.log('meme updated');
		getByName(options.name);
	})
	.catch(err => {
		console.error(err);
	});
}

function displayMemes(data){
	console.log(callerFunction);
	console.log(data);
	$('.results-list').empty();
		if(callerFunction === 'getMemes'){
			for(let i = 0; i < data.length; i++){
				console.log(data[i].name, data[i].origin, data[i].type);
				$('.results-list').append(
					`<li class="result-li" data-id="${data[i]._id}">
					<h3>${data[i].name}</h3>
					<p class="get-separator">Origin: ${data[i].origin}</p>
					<p class="get-separator">Type: ${data[i].type}</p>
					<p class="get-separator">Example: <a class="example-link" href="${data[i].example}">${data[i].example}</a></p>
					<p class="get-separator">ID: ${data[i]._id}</p>
					</li>`);}
		} else if(callerFunction === 'getByName') {
			$('.results-list').append(
				`<li class="result-li" data-id="${data._id}">
				<h3>${data.name}</h3>
				<p class="get-separator">Origin: ${data.origin}</p>
				<p class="get-separator">Type: ${data.type}</p>
				<p class="get-separator">Example: <a class="example-link" href="${data.example}">${data.example}</a></p>
				<p class="get-separator">ID: ${data._id}</p>
				</li>`);
		}
	$('.forms-div').addClass('hidden');
	$('.results').removeClass('hidden');
	$('.reset-div').removeClass('hidden');
}

function getId(){
	$('.results-list').on('click', '.result-li', function(event){
		currentMemeId = $(this).attr('data-id');
	});
}

function watchGet(){
	$('.get-btn').click(function(event) {
		console.log('click successful');
		event.preventDefault();
		getMemes(displayMemes);
	});
}

function watchSearch(){
	$('.forms-div').on('click', '.search-btn', function(event){
		event.preventDefault();
		console.log('search initiated');
		let memeName = $('.search-txt').val();
		console.log(memeName);
		getByName(memeName, displayMemes);
		$('.search-txt').val('');
	});
}

function watchDelete(){
	$('.forms-div').on('click', '.delete-btn', function(event){
		event.preventDefault();
		let memeId = $('.delete-txt').val();
		deleteMeme(memeId);
		$('.delete-txt').val('');
	});
}

function watchSubmission(){
	$('.forms-div').on('click', '.submit-btn', function(event){
		event.preventDefault();
		let memeName = $('.meme-name').val();
		let memeOrigin = $('.meme-origin').val();
		let memeType = $('.meme-type').val();
		let memeExample = $('.meme-example').val();
		let options = {
			name: memeName,
			origin: memeOrigin,
			type: memeType,
			example: memeExample
		};
		submitMeme(options);
		$('.meme-name').val('');
		$('.meme-type').val('');
		$('.meme-origin').val('');
		$('.meme-example').val('');
	});
}

function watchUpdate(){
	$('.forms-div').on('click', '.update-btn', function(event){
		event.preventDefault();
		let updateId = $('.update-id').val();
		let newName = $('.new-meme-name').val();
		let newOrigin = $('.new-meme-origin').val();
		let newType = $('.new-meme-type').val();
		let newExample = $('.new-meme-example').val();
		let options = {
			id: updateId,
			name: newName,
			origin: newOrigin,
			type: newType,
			example: newExample 
		};
		updateMeme(options);
		$('.update-id').val('');
		$('.new-meme-name').val('');
		$('.new-meme-type').val('');
		$('.new-meme-origin').val('');
		$('.new-meme-example').val('');
	})
}

function eventHandler(){
	showSection();
	getId();
	watchGet();
	watchSearch();
	watchDelete();
	watchSubmission();
	watchUpdate();
}

$(eventHandler);