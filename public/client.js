'use strict';

const url = "https://sheltered-fortress-34693.herokuapp.com/memes";

let currentMemeName;

let updateMemeId;

let deleteMemeId;

let callerFunction;


//looks for navigation from the navbar and displays the proper form
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
	//$('.delete-nav').click(function(){
	//	$('.reset-div').addClass('hidden');
	//	$('.results').addClass('hidden');
	//	$('.forms-div').removeClass('hidden').empty().append(`
	//		<form class="delete-form" method="delete">
	//			<p>DELETE A MEME</p>
	//			<label class="meme-delete" for="meme-delete"> Delete a meme by ID:
	//			<input class="delete-txt" type="text" name="meme-delete" placeholder="Enter a meme ID" required="true"></label>
	//			<input role="button" class="delete-btn" type="submit" name="search-btn" value="Delete">
	//		</form>
	//		`);
	//});
	$('.results-list').on('click', '.update-btn', function(){

		let foundMeme = {};

		currentMemeName = String($(this).closest('.result-li').find('.entry-name').html());

		if(!(currentMemeName)){
			$('.results-list').html(`
			<li class="result-li">
			<h3>No meme selected</h3>
			<p class="get-separator">First find a meme and click on it to obtain its id.</p>
			</li>
			`)
			$('.forms-div').addClass('hidden');
			$('.results').removeClass('hidden');
			$('.reset-div').removeClass('hidden');
		} else {
		
		fetch(url + '/search/' + currentMemeName, {
			method: 'GET',
			headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		}})
		.then(response => response.json())
		.then(responseJson => {
			foundMeme._id = responseJson._id || "";
			foundMeme.name = currentMemeName || "";
			foundMeme.origin = responseJson.origin || "";
			foundMeme.type = responseJson.type || "";
			foundMeme.example = responseJson.example || "";
			updateMemeId = foundMeme._id;
			return foundMeme;
		})
		.then(meme => {
		$('.reset-div').addClass('hidden');
		$('.results').addClass('hidden');
		$('.forms-div').removeClass('hidden').empty().append(`
			<form class="update-form" method="post">
				<p>UPDATE A MEME</p>
				<label class="submit-label">Meme ID:<input type="text" name="update-id" class="update-id" value="${meme._id}" disabled="true"></label>
				<label class="submit-label">Meme name:<input type="text" name="new-meme-name" class="new-meme-name" value="${meme.name}" required="true"></label>
				<label class="submit-label">Meme type:<input type="text" name="new-meme-type" class="new-meme-type" value="${meme.type}" required="true"></label>
				<label class="submit-label">Meme origin:<input type="text" name="new-meme-origin" class="new-meme-origin" value="${meme.origin}" required="true"></label>
				<label class="submit-label">Meme example: <input type="text" name="new-meme-example" class="new-meme-example" value="${meme.example}" required="true"></label>
				<input role="button" class="update-submit" type="submit" name="submit-btn" value="Submit">
			</form>
			`);
		});
	}});
}

//gets the current collection of memes
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

//gets a meme by name
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

//deletes a meme by ID only, for security
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

//posts a meme to the database
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
			`<li class="result-li" data-id="${responseJson._id}">
					<h3 name="name"><span class="entry-name">${responseJson.name}</span></h3>
					<p class="get-separator"><a href="${responseJson.example}" class="example-link"><img class="example-img" src="${responseJson.example}"></a></p>
					<p class="get-separator">Origin: ${responseJson.origin}</p>
					<p class="get-separator">Type: ${responseJson.type}</p>
					<p class="get-separator">ID: ${responseJson._id}</p>
					<ul class="actions-ul">
						<li class="actions"><button class="update-btn">Update</button></li>
						<li class="actions"><button class="delete-btn">Delete</button></li>
					</ul>
					</li>`);
		$('.forms-div').addClass('hidden');
		$('.results').removeClass('hidden');
		$('.reset-div').removeClass('hidden');
	})
	.catch(err => {
		console.error(err);
	});
}

//updates a meme in the database
function updateMeme(options){

	let fullUrl = url + '/' + updateMemeId;

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

//displays memes based on the calling function
function displayMemes(data){
	console.log(callerFunction);
	console.log(data);
	$('.results-list').empty();
		if(callerFunction === 'getMemes'){
			console.log('we are in the function!');
			for(let i = 0; i < data.length; i++){
				console.log(data[i].name, data[i].origin, data[i].type);
				$('.results-list').append(
					`<li class="result-li" data-id="${data[i]._id}">
					<h3 name="name"><span class="entry-name">${data[i].name}</span></h3>
					<p class="get-separator"><a href="${data[i].example}" class="example-link"><img class="example-img" src="${data[i].example}"></a></p>
					<p class="get-separator">Origin: ${data[i].origin}</p>
					<p class="get-separator">Type: ${data[i].type}</p>
					<p class="get-separator" >ID: <span class="delete-id">${data[i]._id}</span></p>
					<ul class="actions-ul">
						<li class="actions"><button class="update-btn">Update</button></li>
						<li class="actions"><button class="delete-btn">Delete</button></li>
					</ul>
					</li>`);}
					$('.forms-div').addClass('hidden');
					$('.results').removeClass('hidden');
					$('.reset-div').removeClass('hidden');
		} else if(callerFunction === 'getByName') {
			if(!data){
				$('.results-list').html(`
					<li class="result-li">
					<h3>Meme entry not found</h3>
					<p class="get-separator">Please try another name, or a different meme.</p>
					</li>
					`)
					$('.results').removeClass('hidden');
					$('.reset-div').removeClass('hidden');
			}	else {$('.results-list').append(
				`<li class="result-li" data-id="${data._id}">
					<h3 name="name"><span class="entry-name">${data.name}</span></h3>
					<p class="get-separator"><a href="${data.example}" ="example-link"><img class="example-img" src="${data.example}"></a></p>
					<p class="get-separator">Origin: ${data.origin}</p>
					<p class="get-separator">Type: ${data.type}</p>
					<p class="get-separator" >ID: <span class="delete-id">${data._id}</span></p>
					<ul class="actions-ul">
						<li class="actions"><button class="update-btn">Update</button></li>
						<li class="actions"><button class="delete-btn">Delete</button></li>
					</ul>
					</li>`);
				$('.forms-div').addClass('hidden');
				$('.results').removeClass('hidden');
				$('.reset-div').removeClass('hidden');
			}
		}
	
}

//these next functions watch for the various form submissions, and queries based on the submissions
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
	$('.results-list').on('click', '.delete-btn', function(event){
		event.preventDefault();
		console.log('in the delete function');
		deleteMemeId = String($(this).closest('.result-li').find('.delete-id').html());
		if(confirm("Are you sure you want to delete this meme?")){
			deleteMeme(deleteMemeId);
		} else {
			return false;
		};
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
	$('.forms-div').on('click', '.update-submit', function(event){
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
	watchGet();
	watchSearch();
	watchDelete();
	watchSubmission();
	watchUpdate();
}

$(eventHandler);