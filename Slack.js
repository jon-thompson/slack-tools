var Promise = require('promise'),
	Qs = require('qs'),
	https = require('https'),
	config = require('easy-config');

function Slack () {
	var base = 'https://slack.com/api/';

	var token = 'xoxp-2775016630-2773844917-2830170429-54d2a9';

	this.api = function (methodName, methodArgs) {
		if (arguments.length < 1) {
			throw new Exception('methodName required');
		}

		return new Promise(function (resolve, reject) {
			methodArgs = methodArgs || {};
			methodArgs.token = config.Slack.token;
			var query = '?' + Qs.stringify(methodArgs);

			https.get(base + methodName + query, function (res) {
				var body = '';

				res.on('data', function(chunk) {
					body += chunk;
				});

				res.on('end', function() {
					var result = JSON.parse(body);
					if (result.ok) {
						resolve(result);
					} else {
						reject(result);
					}
				});
			});
		});
	};
}

module.exports = Slack;