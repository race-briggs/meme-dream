'use strict';

const url = "https://sheltered-fortress-34693.herokuapp.com/memes"

let callerFunction;

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
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
			`<li>
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
					`<li>
					<h3>${data[i].name}</h3>
					<p>Origin: ${data[i].origin}</p>
					<p>Type: ${data[i].type}</p>
					<p>ID: ${data[i]._id}</p>
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
	watchGet();
	watchSearch();
	watchDelete();
	watchSubmission();
	watchUpdate();
}

$(eventHandler);