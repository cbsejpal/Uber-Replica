//billing

var billingSchema = require('./model/billingSchema');
var requestGen = require('./commons/responseGenerator');
var dateFormatter = require('./commons/dateFormatter');

var Billings = billingSchema.Billings;

exports.generateBill = function(msg, callback){
	
	var rideId = msg.rideId;
	var customerId = msg.customerId;
	var driverId = msg.driverId;
	var pickUpLocation = msg.pickUpLocation;
	var dropOffLocation = msg.dropOffLocation;
	var rideDate = dateFormatter.dateMMDDYYYYformater(new Date()); //msg.rideDate
	var rideStartTime = dateFormatter.dateMMDDYYYYformater(new Date()); //msg.rideStartDateTime
	var rideEndTime = dateFormatter.dateMMDDYYYYformater(new Date()); //msg.rideEndDateTime
	var rideDistance ; //= msg.rideDistance;
	//var rideAmount = msg.rideAmount;

	request({
		url: 'https://maps.googleapis.com/maps/api/distancematrix/json', //URL to hit
		qs: {origins: pickUpLocation ,destinations:dropOffLocation ,mode:"driving",language:"us-EN"},
		method: 'GET'
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			rideDistance = JSON.parse(body).rows[0].elements[0].distance.value * 0.000621371;

			//Call dynamic pricing algorithm here
		}
	});

	var json_responses;

	var newBill = new Billings({
		rideId: rideId,
		rideDate: rideDate,
		rideStartTime: rideStartTime,
		rideEndTime: rideEndTime,
		rideDistance: rideDistance,
		rideAmount: rideDistance,
		pickUpLocation: pickUpLocation,
		dropOffLocation: dropOffLocation,
		customerId: customerId,
		driverId: driverId
	});

	newBill.save(function(err) {

		if (err) {
			json_responses = requestGen.responseGenerator(500, {message: " error generating bill" });
		}
		else {
			json_responses = requestGen.responseGenerator(200, newBill);
		}
//		billingSchema.closeConnection();
		callback(null,json_responses);
	});

};

exports.billingSearch = function(msg, callback){

	var json_response;

	var searchText = msg.searchText;

	var data = [];

	Billings.find({ $or : [ { rideDate : new RegExp(searchText, 'i')},
		{ pickUpLocation : new RegExp(searchText, 'i') },{ dropOffLocation : new RegExp(searchText, 'i') },
		{ customerId : new RegExp(searchText, 'i') },{ driverId : new RegExp(searchText, 'i') } ] }, function(err, docs) {
		if (err) {
			json_response = requestGen.responseGenerator(401, null);
		} else {
			console.log("docs" + docs);

			if (docs.length > 0) {

				docs.forEach(function(doc) {
					data.push({
						billingId: doc.billingId,
						rideId: doc.rideId,
						rideDate: doc.rideDate,
						rideStartTime: doc.rideStartTime,
						rideEndTime: doc.rideEndTime,
						rideDistance: doc.rideDistance,
						rideAmount: doc.rideAmount,
						pickUpLocation: doc.pickUpLocation,
						dropOffLocation: doc.dropOffLocation,
						customerId: doc.customerId,
						driverId: doc.driverId
					});
				});

				json_response = requestGen.responseGenerator(200, data);

			} else {
				json_response = requestGen.responseGenerator(200, null);
			}
		}
		callback(null, json_response);
	});
};

exports.deleteBill = function (msg, callback) {
	var billId = msg.billId;
	var json_responses;

	Billings.remove({billId: billId}, function (err, removed) {
		if (err) {
			json_responses = requestGen.responseGenerator(500, {message: 'Bill delete failed'});
		}
		else {
			if (removed.result.n > 0) {
				json_responses = requestGen.responseGenerator(200, {message: 'Bill Deleted.'});
			} else {
				json_responses = requestGen.responseGenerator(500, {message: 'Bill Not Found'});
			}
		}
		callback(null, json_responses);
	});
};