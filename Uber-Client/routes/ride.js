//rides
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.createRide = function(req, res){

	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var pickUpLatLong = req.param('pickUpLatLong');
	var dropOffLatLong = req.param('dropOffLatLong');
	//var rideStartDateTime = new Date();
	var customerId = req.session.customerId;
	var driverId = req.param('driverId');

	var msg_payload = {
		"pickUpLocation" : pickUpLocation,
		"dropOffLocation" : dropOffLocation,
		"pickUpLatLong" : pickUpLatLong,
		"dropOffLatLong" : dropOffLatLong,
		//"rideStartDateTime" : rideStartDateTime,
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
			//req.session.rideId = results.data.rideId;
			res.status(results.status).send(results.data);
		}
	});
};

exports.getRideInformation = function(req, res){
	var customerId = req.session.customerId;
	console.log(customerId);
	//var customerId = req.session.customerId;
		//req.session.customerId;
	//console.log("Rides info :"+customerId);

	var msg_payload = {
		"customerId" : customerId,
		"func" : "RideInfo"
	};

	mq_client.make_request('ride_queue', msg_payload, function(err,results) {
		console.log("results for rides " + JSON.stringify(results));
		
		if (err) {
			//console.log(err);
			res.status(500).send(null);
		} else {
			
			////console.log("about results" + results);
			res.send(results);
		}
	});
};

exports.updateRide = function(req,res){
	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var rideId = req.param('rideId');

	var msg_payload = {
		"pickUpLocation" : pickUpLocation,
		"dropOffLocation" : dropOffLocation,
		"rideId" : rideId,
		"func" : "updateRide"
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

exports.deleteRide = function(req,res){
	var rideId = req.param('rideId');

	var msg_payload = {
		"rideId" : rideId,
		"func" : "deleteRide"
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

exports.customerRideList = function (req,res) {
	var customerId = req.param('customerId');

	var msg_payload = {
		"customerId" : customerId,
		"func": "customerRideList"
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

exports.driverRideList = function (req,res) {
	var driverId = req.session.driverId;
	console.log("driverRideList function : "+driverId);
	var msg_payload = {
		"driverId" : driverId,
		"func": "driverRideList"
	};

	mq_client.make_request('ride_queue', msg_payload, function(err,results) {
		//console.log(results);
		if (err) {
			
			res.status(500).send(null);
		} else {
			console.log("eni masi ne chodu" + results);
			res.send(results);
		}
	});
};

exports.endRide = function(req, res){

	var dropOffLatLong = req.param('dropOffLatLong');
	var dropOffLocation = req.param('dropOffLocation');
	var rideId = req.param('rideId');

	var driverId = req.session.driverId;

	var msg_payload = {
		"rideId" : rideId,
		"dropOffLatLong" : dropOffLatLong,
		"dropOffLocation" : dropOffLocation,
		"driverId" : driverId,
		"func": "endRide"
	};

	mq_client.make_request('ride_queue', msg_payload, function(err,results) {
		//console.log(results);
		if (err) {
			//console.log(err);
			res.status(500).send(null);
		} else {
			////console.log("about results" + results);
			res.send(results);
		}
	});
};

exports.startRide = function(req, res){

	var rideId = req.param('rideId');
	var driverId = req.session.driverId;

	var msg_payload = {
		"rideId" : rideId,
		"func" : "startRide"
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

exports.getRideInfo = function (req, res) {

	var rideId = req.param('rideId');

	var msg_payload = {
		"rideId" : rideId,
		"func" : "getRideInfo"
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