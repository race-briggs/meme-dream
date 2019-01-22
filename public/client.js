'use strict';

const url = "https://sheltered-fortress-34693.herokuapp.com/memes"

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
				<p class="dual-header">SEARCH FOR A MEME</p>
				<label class="meme-search" for="meme-search"> Search for a meme by ID:
				<input class="search-txt" type="text" name="meme-search" placeholder="Enter a meme ID" required="true"></label>
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
				<label class="submit-label">Example image:<input type="text" name="meme-origin" class="meme-image" placeholder="Image url"></label>
				<input role="button" class="submit-btn" type="submit" name="submit-btn" value="Submit">
			</form>
			`);
	});
	$('.delete-nav').click(function(){
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="delete-form" method="delete">
				<p class="dual-header">DELETE A MEME</p>
				<label class="meme-delete" for="meme-delete"> Delete a meme by ID:
				<input class="delete-txt" type="text" name="meme-delete" placeholder="Enter a meme ID" required="true"></label>
				<input role="button" class="delete-btn" type="submit" name="search-btn" value="Delete">
			</form>
			`);
	});
	$('.update-nav').click(function(){
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="update-form" method="post">
				<p>UPDATE A MEME</p>
				<label class="submit-label">Meme ID:<input type="text" name="update-id" class="update-id" placeholder="Enter the Meme ID" required="true"></label>
				<label class="submit-label">Meme name:<input type="text" name="new-meme-name" class="new-meme-name" placeholder="New name" required="true"></label>
				<label class="submit-label">Meme type:<input type="text" name="new-meme-type" class="new-meme-type" placeholder="New type" required="true"></label>
				<label class="submit-label">Meme origin:<input type="text" name="new-meme-origin" class="new-meme-origin" placeholder="New origin"></label>
				<input role="button" class="update-btn" type="submit" name="submit-btn" value="Submit">
			</form>
			`);
	});
}

function getMemes(callbackFn){
	callerFunction = 'getMemes';
	fetch(url, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*',
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

function getById(id, callbackFn){

	callerFunction = 'getById';

	let urlWithId = url + '/' + id;

		fetch(urlWithId, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*',
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

function deleteMeme(id){
	let urlWithId = url + '/' + id;

	fetch(urlWithId, {
	method: 'DELETE',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json'
	}})
	.then(response => {
		console.log(response);
		return response.json();
	})
	.then(responseJson => {
		console.log(responseJson)
		$('.results-list').empty();
		$('.results-list').append(
			`<li><h3>${responseJson.message} at ID: ${responseJson._id}</h3></li>
			`);
		$('.results-list').removeClass('hidden');
		$('.reset-div').removeClass('hidden');
		$('.forms-div').addClass('hidden');
	})
	.catch(err => {
		console.error(err);
	});
}

function submitMeme(memeName, memeOrigin, memeType){

	let memeData = {
		name: memeName,
		origin: memeOrigin,
		type: memeType
	};

	fetch(url, {
		method: 'POST',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(memeData)
	})
	.then(response => response.json())
	.then(responseJson => {
		console.log('Submission successful');
		console.log(responseJson);
		$('.results-list').empty();
		$('.results-list').append(
			`<li class="result-li">
			<h3>${responseJson.name}</h3>
			<p>Origin: ${responseJson.origin}</p>
			<p>Type: ${responseJson.type}</p>
			<p>ID: ${responseJson._id}</p>
			</li>`);
		$('.forms-div').addClass('hidden');
		$('.results').removeClass('hidden');
		$('.reset-div').removeClass('hidden');
	})
	.catch(err => {
		console.error(err);
	});
}

function updateMeme(id, newName, newType, newOrigin){
	let newData = {
		name: newName,
		type: newType,
		origin: newOrigin
	};

	let fullUrl = url + '/' + id;

	fetch(fullUrl, {
		method: 'PUT',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newData)
	})
	.then(response => {
		console.log('meme updated');
		getById(id);
	})
	.catch(err => {
		console.error(err);
	});
}

function displayMemes(data){
	console.log(callerFunction);
	$('.results-list').empty();
		if(callerFunction === 'getMemes'){
			for(let i = 0; i < data.length; i++){
				console.log(data[i].name, data[i].origin, data[i].type);
				$('.results-list').append(
					`<li class="get-result">
					<h3>${data[i].name}</h3>
					<p class="get-separator">Origin: ${data[i].origin}</p>
					<p class="get-separator">Type: ${data[i].type}</p>
					<p class="get-separator">ID: ${data[i]._id}</p>
					</li>`);}
		} else if(callerFunction === 'getById') {
			$('.results-list').append(
				`<li>
				<h3>${data.name}</h3>
				<p>Origin: ${data.origin}</p>
				<p>Type: ${data.type}</p>
				<p>ID: ${data._id}</p>
				</li>`);
		}
	$('.forms-div').addClass('hidden');
	$('.results').removeClass('hidden');
	$('.reset-div').removeClass('hidden');
}

function watchGet(){
	$('.get-btn').click(function(event) {
		console.log('click successful');
		event.preventDefault();
		getMemes(displayMemes);
	});
}

function watchSearch(){
	$('.search-form').submit(function(event){
		event.preventDefault();
		console.log('search initiated');
		let memeId = $('.search-txt').val();
		getById(memeId, displayMemes);
		$('.search-txt').val('');
	});
}

function watchDelete(){
	$('.delete-form').submit(function(event){
		event.preventDefault();
		let memeId = $('.delete-txt').val();
		deleteMeme(memeId);
		$('.delete-txt').val('');
	});
}

function watchSubmission(){
	$('.submit-form').submit(function(event){
		event.preventDefault();
		let memeName = $('.meme-name').val();
		let memeOrigin = $('.meme-origin').val();
		let memeType = $('.meme-type').val();
		submitMeme(memeName, memeOrigin, memeType);
		$('.meme-name').val('');
		$('.meme-type').val('');
		$('.meme-origin').val('');
	});
}

function watchUpdate(){
	$('.update-form').submit(function(event){
		event.preventDefault();
		let updateId = $('.update-id').val();
		let newName = $('.new-meme-name').val();
		let newOrigin = $('.new-meme-origin').val();
		let newType = $('.new-meme-type').val();
		updateMeme(updateId, newName, newOrigin, newType);
		$('.update-id').val('');
		$('.new-meme-name').val('');
		$('.new-meme-type').val('');
		$('.new-meme-origin').val('');
	})
}

function eventHandler(){
	showSection();
	watchGet();
	watchSearch();
	watchDelete();
	watchSubmission();
	watchUpdate();
}

$(eventHandler);