//billing

var billingSchema = require('./model/billingSchema');

var Billings = billingSchema.Billings;

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
			res.send(500, {message: " error generating bill" });
		}
		else {
			res.send(200, {message: " bill generated for this ride" });
		}
	});
	
};