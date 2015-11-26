//billing
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');
var dateFormatter = require('./commons/dateFormatter');

exports.generateBill = function(req, res){
	
	var rideId = req.param('rideId');
	var customerId = req.param('customerId');
	var driverId = req.param('driverId');
	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var rideDate = dateFormatter.dateMMDDYYYYformater(new Date());
	var rideStartTime = dateFormatter.dateMMDDYYYYformater(new Date());
	var rideEndTime = dateFormatter.dateMMDDYYYYformater(new Date());
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

exports.deleteBill = function(req, res){

	var billId =  req.param('billId');

	var msg_payload = {
		"billId": billId,
		"func" : "deleteBill"
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

exports.searchBills = function(req, res){
	var searchText =  req.param('searchText');

	var msg_payload = {
		"searchText": searchText,
		"func" : "billingSearch"
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
