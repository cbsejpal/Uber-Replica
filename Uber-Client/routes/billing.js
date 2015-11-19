//billing
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.generateBill = function(req, res){
	
	var rideId = req.param('rideId');
	var customerId = req.param('customerId');
	var driverId = req.param('driverId');
	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var rideDate = new Date();
	var rideStartTime = new Date();
	var rideEndTime = new Date();
	var rideDistance = req.param('rideDistance');
	var rideAmount = req.param('rideAmount');

	var msg_payload = {
		"rideId" : rideId,
		"customerId" : customerId,
		"driverId" : driverId,
		"pickUpLocation" : pickUpLocation,
		"dropOffLocation" : dropOffLocation,
		"rideDate" : rideDate,
		"rideStartTime" : rideStartTime,
		"rideEndTime" : rideEndTime,
		"rideDistance" : rideDistance,
		"rideAmount" : rideAmount,
		"func" : "generateBill"
	};

	mq_client.make_request('bill_queue', msg_payload, function(err,results) {
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