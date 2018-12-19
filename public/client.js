'use strict';

let MOCK_API_DATA = {
	"memes": [
		{
			"name": 'Kappa',
			"type": 'emoticon',
			"collection": 'twitch',
			"origin": 'Twitch'
		},
		{
			"name": 'Navy Seal',
			"type": 'copypasta'
			"collection": 'text'
			"origin": '4chan'
		},
		{
			"name": 'Moth Memes'
			"type": 'picture'
			"collection": 'picture'
			"origin": 'unknown'
		},
		{
			"name": 'Used Car Salesman'
			"type": 'picture'
			"collection": 'picture'
			"origin": 'Reddit'
		},
		{
			"name": 'Hell in a Cell'
			"type": 'text bait'
			"collection": 'text'
			"origin": 'Reddit'
		}
	]	
};

function getMemes(func){
	setTimeout(function(){func(MOCK_API_DATA)}, 1);
};

function displayMemes(data){
	for(index in data.memes){
		$('body').append(
			`<p>${data.memes[index].name}</p>`
			);
	};
};

function getAndDisplayMemes() {
	getMemes(displayMemes);
};

$(function(){
	getAndDisplayMemes();
})