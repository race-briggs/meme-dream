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

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getMemes(callbackFn){
	let myHeaders = new Headers({
		'Access-Control-Allow-Origin': '*'
	})

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

function displayMemes(data){
	console.log(data);

	//for(index in data.memeList){
	//	$('.results-list').append(
	//		`<li>${}</li>`);
	//};
}

function watchGet(){
	$('.get-btn').click(function(event) {
		console.log('click successful');
		event.preventDefault();
		getMemes(displayMemes);
	});
}

$(watchGet);