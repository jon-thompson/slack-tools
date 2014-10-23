var Slack = require('./Slack.js'),
	Datastore = require('nedb'),
	Promise = require('promise');


var MESSAGES_PER_PAGE = 1000,
	LOG_DIR = './dm/'

var username = process.argv[2];

if (!username) {
	throw 'username required';
}


var db = new Datastore({
	filename: LOG_DIR + username + '-' + Date.now().toString(),
	autoload: true
});

var slack = new Slack();

function getPageMessages(page) {
	page = page || 1;

	return new Promise(function (resolve, reject) {
		slack.api('search.messages', {
			query: 'in:' + username,
			count: MESSAGES_PER_PAGE,
			page: page
		}).then(function (result) {
			resolve({
				page: page,
				pages: result.messages.paging.pages,
				messages: result.messages.matches
			});
		});
	});
}

function saveMessages (messages) {
	db.insert(messages, function (err, results) {
		console.log(results.length + ' messages saved for ' + username);
	});
}

getPageMessages().then(function (result) {
	saveMessages(result.messages);

	for (var page = result.page + 1; page <= result.pages; page++) {
		getPageMessages(page).then(function (r) {
			saveMessages(r.messages);
		});
	}
});

