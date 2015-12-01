/**
 *
 *	Original Backup file is below || Uncomment if needed
 *
 * 	REDIS integrated
 **/


var amqp = require('amqp');
var rediscache = require('../routes/redisresponsecache')

var connection = amqp.createConnection({
	host : '127.0.0.1'
});
var rpc = new (require('./amqprpc'))(connection);
var outstanding = 0; // counter of outstanding requests

function make_request(queue_name, msg_payload, callback) {
	outstanding += 1;
	// check for response cache
	if (msg_payload.httpreqtype == "GET" && msg_payload.reqtype=="/reddis/search") {
		rediscache.getClient().get(
				"Response:" + msg_payload.reqtype + "/"+ msg_payload.data.operation + "/"+ msg_payload.data.searchparam,
				function(error, result) {
					if (error)
						console.log('Error: ' + error);
					else {
						data = result;
						if (data != null && data.length != 0 && data != undefined) {
							console.log("cached Reponse");
							res = result;
							callback(null, JSON.parse(res))
						}
						else {
							rpc.makeRequest(queue_name,msg_payload,function(err, response) {
								// console.log("Hello bhai kaise ho?")
								if (err) {
									console.log("Error aa gaya?")
									console.error(err);
								}
								else {
									// console.log("response",response);
									// cache response
									console.log('Caching data');
									rediscache.getClient().set(
											"Response:"+ msg_payload.reqtype+"/"+ msg_payload.data.operation+"/"
											+ msg_payload.data.searchparam, JSON.stringify(response));
									rediscache.getClient().expire("Response:"+ msg_payload.reqtype
											+ "/"+ msg_payload.data.operation+ "/"+ msg_payload.data.searchparam,120);
									console.log('Caching complete');
									callback(null,response);
								}
								outstanding -= 1;
								// isAllDone();
							});
						}
					}
				});
	}
	else {
		rpc.makeRequest(queue_name, msg_payload, function(err, response) {
			if (err)
				console.error(err);
			else {
				console.log("response", response);
				callback(null, response);
			}
			// connection.end();
		});
	}
}

function isAllDone() {
	// if no more outstanding then close connection
	if (outstanding === 0) {
		// connection.end();
		console.log("ending connection")
	}
}

exports.make_request = make_request;





/*var amqp = require('amqp');

var connection = amqp.createConnection({
	host : '127.0.0.1'
});
var rpc = new (require('./amqprpc'))(connection);

function make_request(queue_name, msg_payload, callback) {

	rpc.makeRequest(queue_name, msg_payload, function(err, response) {
		if (err)
			console.error(err);
		else {
			console.log("response", response);
			callback(null, response);
		}
		// connection.end();
	});
}

exports.make_request = make_request;*/
