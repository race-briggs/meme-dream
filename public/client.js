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

const searchUrl = "https://sheltered-fortress-34693.herokuapp.com/memes"

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getMemes(query){
	setTimeout(function(){callbackFn(MOCK_API_DATA)}, 1);

	const params = {

	};

	url = searchUrl + '?' query;

	fetch(url)
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error(respnose.statusText);
		})
		.then(responseJson => displayMemes(responseJson))
		.catch(err => {
			console.error(err);
		});

}

function displayMemes(data){
	for(index in data.memeList){
		$('body').append(
			'<p>' + data.memeList[index].name '</p>');
	};
};

function getAndDisplayMemes() {
	getMemes(displayMemes);
};

$(function(){
	getAndDisplayMemes();
})