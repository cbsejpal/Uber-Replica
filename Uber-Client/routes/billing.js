//billing
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

var io = require('./socket');

exports.generateBill = function(req, res){
	
	var rideId = req.param('rideId');
	var customerId = req.param('customerId');
	var driverId = req.param('driverId');
	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var rideDate = new Date();
	var rideStartTime = req.param('rideStartDateTime');
	var rideEndTime = req.param('rideEndDateTime');
	//var rideDistance = req.param('rideDistance');
	//var rideAmount = req.param('rideAmount');

	//Valdidations
	if(rideId==undefined || customerId==undefined || driverId==undefined
		|| pickUpLocation==undefined || dropOffLocation==undefined || rideDate==undefined
			|| rideStartTime==undefined || rideEndTime==undefined){

		console.log("generateBill parameter entry error" );
		res.status(500);
		json_responses = {"statusCode":500};
		res.send(json_responses);

	}
	else{/*
		if( ! (rideId.length > 0 && customerId.length > 0 && driverId.length > 0
				&& pickUpLocation.length > 0 && dropOffLocation.length > 0 && rideDate.length > 0
				&& rideStartTime.length > 0 && rideEndTime.length > 0) ){


			console.log("generateBill validation entry error" );
			res.status(500);
			json_responses = {"statusCode":500};
			res.send(json_responses);
		}
		else{*/

			var msg_payload = {
				"rideId" : rideId,
				"customerId" : customerId,
				"driverId" : driverId,
				"pickUpLocation" : pickUpLocation,
				"dropOffLocation" : dropOffLocation,
				"rideDate" : rideDate,
				"rideStartTime" : rideStartTime,
				"rideEndTime" : rideEndTime,
				"func" : "generateBill"
			};

			mq_client.make_request('bill_queue', msg_payload, function(err,results) {
				//console.log(results);
				if (err) {
					//console.log(err);
					res.status(500).send(null);
				} else {
					////console.log("about results" + results);
					if(results.status == 200){
						io.onBillGenerated(customerId,results.data);
						console.log("Emit: ", customerId);
					}
					res.status(results.status).send(results.data);
				}
			});
		}

	//}

};

exports.deleteBill = function(req, res){

	var billId =  req.param('billId');

	//Valdidations
	if(billId==undefined){
		console.log("deleteBill parameter entry error" );
		res.status(500);
		json_responses = {"statusCode":500};
		res.send(json_responses);
	}
	else{

		if( ! (billId) ){

			console.log("deleteBill validation entry error" );
			res.status(500);
			json_responses = {"statusCode":500};
			res.send(json_responses);
		}
		else{
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
		}
	}

};

exports.searchBills = function(req, res){
	var searchText =  req.param('searchText');
	var startPosition = req.param('startPosition');
	//Removed validations

	var msg_payload = {
		"startPosition" : startPosition,
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


exports.getBill = function(req, res){

	var billId = req.param('billId');

	if(billId==undefined){
		console.log("getBill parameter entry error" );
		res.status(500);
		json_responses = {"statusCode":500};
		res.send(json_responses);
	}
	else{
		if(!billId){
			console.log("getBill validation entry error" );
			res.status(500);
			json_responses = {"statusCode":500};
			res.send(json_responses);
		}
		else{
			var msg_payload = {
				"billId": billId,
				"func" : "getBill"
			};

			mq_client.make_request('bill_queue', msg_payload, function(err,results) {
				//console.log(results);
				if (err) {
					//console.log(err);
					res.status(500).send(null);
				} else {
					console.log("bill results " + results);
					res.status(results.status).send(results.data);
				}
			});
		}
	}

};