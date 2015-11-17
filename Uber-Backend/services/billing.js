//billing

var billingSchema = require('./model/billingSchema');
var requestGen = require('./commons/responseGenerator');

var Billings = billingSchema.Billings;

exports.generateBill = function(msg, callback){
	
	var rideId = msg.rideId;
	var customerId = msg.customerId;
	var driverId = msg.driverId;
	var pickUpLocation = msg.pickUpLocation;
	var dropOffLocation = msg.dropOffLocation;
	var rideDate = new Date();
	var rideStartTime = new Date();
	var rideEndTime = new Date();
	var rideDistance = msg.rideDistance;
	var rideAmount = msg.rideAmount;

	var json_responses;

	var newBill = new Billings({
		rideId: rideId,
		rideDate: rideDate,
		rideStartTime: rideStartTime,
		rideEndTime: rideEndTime,
		rideDistance: rideDistance,
		rideAmount: rideAmount,
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
			json_responses = requestGen.responseGenerator(200, {message: " bill generated for this ride" });
		}
		callback(null,json_responses);
	});
	
};