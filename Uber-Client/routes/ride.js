//rides

var rideSchema = require('./model/rideSchema');
var customerSchema = require('./model/customerSchema');
var driverSchema = require('./model/driverSchema');

var Customers = customerSchema.Customers; //mongoDB instance
var Drivers = driverSchema.Drivers; //mongoDB instance

var Rides = rideSchema.Rides;

exports.createRide = function(req, res){

	var pickUpLocation = req.param('pickUpLocation');
	var dropOffLocation = req.param('dropOffLocation');
	var rideDateTime = new Date();
	var customerId = req.param('customerId');
	var driverId = req.param('driverId');

	var newRide = new Rides({
		pickUpLocation: pickUpLocation,
		dropOffLocation: dropOffLocation,
		rideDateTime: rideDateTime,
		customerId: customerId,
		driverId: driverId
	});

	var rideId;

	newRide.save(function(err) {

		if (err) {
			res.send(500, {message: " error creating Ride" });
		}
		else {

			Rides.findOne({rideDateTime: rideDateTime, $and: [{customerId: customerId}, {driverId: driverId}]}, function(err, doc){
				if(err){
					res.send(500, {message: " error finding rideId" });
				}
				else{
					rideId = doc.rideId;

					Customers.findOne({custId: customerId}, function(err, doc){
						if(err){
							res.send(500, {message: " error adding ride to customer" });
						}
						else{
							doc.rides.push({
								rideId: rideId
							});
							doc.save();

							Drivers.findOne({driId: driverId}, function(err, doc){
								if(err){
									res.send(500, {message: " error adding ride to driver" });
								}
								else{
									doc.rides.push({
										rideId: rideId
									});
									doc.save();

									res.send(200, {message: "ride created successfully" });
								}
							});
						}
					});
				}
			});
		}
	});  
};