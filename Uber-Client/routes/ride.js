//rides
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.createRide = function(req, res){

	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var rideDateTime = new Date();
	var customerId = req.param('customerId');
	var driverId = req.param('driverId');

	var msg_payload = {
		"pickUpLocation" : pickUpLocation,
		"dropOffLocation" : dropOffLocation,
		"rideDateTime" : rideDateTime,
		"customerId" : customerId,
		"driverId" : driverId,
		"func": "createRide"
	};

	mq_client.make_request('ride_queue', msg_payload, function(err,results) {
		//console.log(results);
		if (err) {
			//console.log(err);
			res.status(500).send(null);
		} else {
			////console.log("about results" + results);
			res.status(results.status).send(results.data);
		}
	});
};