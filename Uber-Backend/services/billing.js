//billing

var billingSchema = require('./model/billingSchema');
var requestGen = require('./commons/responseGenerator');
var dateFormatter = require('./commons/dateFormatter');
var request = require('request');

//For dynamic algo
var driverSchema = require('./model/driverSchema');
var Drivers = driverSchema.Drivers; //mongoDB instance

var Billings = billingSchema.Billings;

exports.generateBill = function(msg, callback){

	var rideId = msg.rideId;
	var customerId = msg.customerId;
	var driverId = msg.driverId;
	var pickUpLocation = msg.pickUpLocation;
	var dropOffLocation = msg.dropOffLocation;
	var rideDate = dateFormatter.dateMMDDYYYYformater(new Date()); //msg.rideDate
	var rideStartTime = new Date(msg.rideStartTime); //msg.rideStartDateTime
	var rideEndTime = new Date(msg.rideEndTime); //msg.rideEndDateTime
	//var rideDistance ; //= msg.rideDistance;
	//var rideAmount = msg.rideAmount;


	//Dynamic Algo Variables
	var rideTime = new Date();
	var rideDistance ;
	var activeRides	;	//Query called
	//var availableDrivers;	//Query called
	var final_price = 0;
	var base_price = 3;		// 3$ - minimal rate

	request({
		url: 'https://maps.googleapis.com/maps/api/distancematrix/json', //URL to hit
		qs: { origins: pickUpLocation ,destinations:dropOffLocation ,mode:"driving",language:"us-EN"},
		method: 'GET'
	}, function(error, response, body) {
		if (error) {
			json_responses = requestGen.responseGenerator(500, {message: " error generating location"});
			callback(null,json_responses);
		} else {
			rideDistance = JSON.parse(body).rows[0].elements[0].distance.value * 0.000621371;
			//console.log("all distance"+JSON.stringify(JSON.parse(body).rows[0]));
			//Setting variables for algo
			Drivers.find({isBusy: true}, function (err, driver) {

				if (driver) {
					//console.log("Total busy drivers" + driver.length);

					activeRides = driver.length;

					//Algo
					// 	Change price according to rideDistance
					if(rideDistance>1)
						base_price = 1.5 * rideDistance ;console.log("Distance > 1");
					//	Change price according to number of active rides
					if(activeRides<5){
						final_price = base_price;console.log("activeRides < 5");
					}
					else{
						final_price = base_price + activeRides*0.2;console.log("activeRides > 5");
					}

					/**	#FOR FUTURE USE
					 * 	Disabled this module currently
					 */
					//	Change price according to number of available drivers
					/*if(availableDrivers>20) {
					 final_price = final_price  - availableDrivers*0.2;
					 }
					 else if(availableDrivers>15) {
					 final_price = final_price  - availableDrivers*0.1;
					 }
					 else if(availableDrivers>10) {
					 final_price = final_price  - availableDrivers*0.05;
					 }
					 else {
					 final_price = final_price  + availableDrivers*0.2;
					 }*/
					var day = rideTime.getDay(); // It will return number of day in a week
					var hour = rideTime.getHours(); // It will return hours 0-23
					console.log("day"+day);
					console.log("hour"+hour);
					//	Change price according to time
					if((day>5 && hour<7) || (day>5 && hour>21)) {
						if(rideDistance>1){
							final_price = final_price + rideDistance;console.log("weekendPrice normal time > 1");
						}
						else{
							final_price = final_price + 1;console.log("weekendPrice normal time < 1");
						}
					}
					//	Change price according to time
					if((hour<7 || hour>21)) {
						if (rideDistance > 1) {
							final_price = final_price + rideDistance;console.log("night time Normal days > 1");
						}
						else {
							final_price = final_price + 1;console.log("night time Normal days < 1");
						}
						//Increasing 20% for weekends (Friday,Sat,Sunday)
						if (day > 4 || day == 0) {
							final_price = 1.20 * final_price;console.log("Weekend today !!")
						}
					}
					console.log(final_price);

					var json_responses;

					var newBill = new Billings({
						rideId: rideId,
						rideDate: rideDate,
						rideStartTime: rideStartTime,
						rideEndTime: rideEndTime,
						rideDistance: Number((rideDistance).toFixed(2)),
						rideAmount: Number((final_price).toFixed(2)),
						pickUpLocation: pickUpLocation,
						dropOffLocation: dropOffLocation,
						customerId: customerId,
						driverId: driverId
					});

					console.log(JSON.stringify(newBill));

					newBill.save(function(err) {

						if (err) {
							console.log(err);
							json_responses = requestGen.responseGenerator(500, {message: " error generating bill" });
						}
						else {
							json_responses = requestGen.responseGenerator(200, newBill);
						}
						//		billingSchema.closeConnection();
						callback(null,json_responses);
					});

				}

			});

		}
	});
};

exports.billingSearch = function(msg, callback){

	var json_response;

	var searchText = msg.searchText;
	var offset = msg.startPosition;

	var data = [];

	Billings.find({ $or : [ { rideDate : new RegExp(searchText, 'i')},
		{ pickUpLocation : new RegExp(searchText, 'i') },{ dropOffLocation : new RegExp(searchText, 'i') },
		{ customerId : new RegExp(searchText, 'i') },{ driverId : new RegExp(searchText, 'i') } ] }, function(err, docs) {
		if (err) {
			json_response = requestGen.responseGenerator(401, null);
		} else {
			console.log("docs" + docs);


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
				console.log("Billing",data);
				json_response = requestGen.responseGenerator(200, data);

		}
		callback(null, json_response);
	}).skip(offset).limit(50);
};

exports.deleteBill = function (msg, callback) {
	var billId = msg.billId;
	var json_responses;

	Billings.remove({billingId: billId}, function (err, removed) {
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

exports.getBill = function(msg, callback){

	var billId = msg.billId;

	var json_responses;

	Billings.findOne({billingId: billId}, function(err, bill){
		if (err) {
			json_responses = requestGen.responseGenerator(500, {message: 'Error in Bill Finding'});
			callback(null, json_responses);
		}
		else{
			if(bill){
				json_responses = requestGen.responseGenerator(200, bill);
				callback(null, json_responses);
			}
			else{
				json_responses = requestGen.responseGenerator(500, {message: 'No Bill Found'});
				callback(null, json_responses);
			}
		}
	});

};