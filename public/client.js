'use strict';

//let MOCK_API_DATA = {
//	"memeList": [
//		{
//			"name": "Kappa",
//			"type": "emoticon",
//			"collection": "twitch",
//			"origin": "Twitch"
//		},
//		{
//			"name": "Navy Seal",
//			"type": "copypasta",
//			"collection": "text",
//			"origin": "4chan"
//		},
//		{
//			"name": "Moth Memes",
//			"type": "picture",
//			"collection": "picture",
//			"origin": "unknown"
//		},
//		{
//			"name": "Used Car Salesman",
//			"type": "picture",
//			"collection": "picture",
//			"origin": "Reddit"
//		},
//		{
//			"name": "Hell in a Cell",
//			"type": "text bait",
//			"collection": "text",
//			"origin": "Reddit"
//		}
//	]	
//};

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

	$('.results').removeClass('hidden');
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
	});
	$('.search-txt').val('');
}

function eventHandler(){
	watchGet();
	watchSearch();
}

$(eventHandler);