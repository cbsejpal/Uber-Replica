//rides

var rideSchema = require('./model/rideSchema');
var customerSchema = require('./model/customerSchema');
var driverSchema = require('./model/driverSchema');
var requestGen = require('./commons/responseGenerator');

var Customers = customerSchema.Customers; //mongoDB instance
var Drivers = driverSchema.Drivers; //mongoDB instance

var Rides = rideSchema.Rides;


exports.createRide = function (msg, callback) {

    var pickUpLocation = msg.pickUpLocation;
    var dropOffLocation = msg.dropOffLocation;
    var pickUpLatLong = msg.pickUpLatLong;
    var dropOffLatLong = msg.dropOffLatLong;
    //var rideStartDateTime = msg.rideStartDateTime;
    var customerId = msg.customerId;
    var driverId = msg.driverId;

    var newRide = new Rides({
        pickUpLocation: pickUpLocation,
        dropOffLocation: dropOffLocation,
        pickUpLatLong: pickUpLatLong,
        dropOffLatLong: dropOffLatLong,
        //rideStartDateTime: rideStartDateTime,
        customerId: customerId,
        driverId: driverId
    });

    var json_responses;

    var rideId;

    newRide.save(function (err) {

        if (err) {
            json_responses = requestGen.responseGenerator(500, {message: " error creating Ride"});
            callback(null, json_responses);
        }
        else {

            Rides.findOne({
                $and: [{customerId: customerId}, {driverId: driverId}]
            }, function (err, doc) {
                if (err) {
                    json_responses = requestGen.responseGenerator(500, {message: " error finding rideId"});
                    callback(null, json_responses);
                }
                else {
                    rideId = doc.rideId;

                    Customers.findOne({custId: customerId}, function (err, doc) {
                        if (err) {
                            json_responses = requestGen.responseGenerator(500, {message: " error adding ride to customer"});
                            callback(null, json_responses);
                        }
                        else {
                            doc.rides.push({
                                rideId: rideId
                            });
                            doc.save();

                            Drivers.findOne({driId: driverId}, function (err, doc) {
                                if (err) {
                                    json_responses = requestGen.responseGenerator(500, {message: " error adding ride to driver"});
                                    callback(null, json_responses);
                                }
                                else {
                                    doc.rides.push({
                                        rideId: rideId
                                    });
                                    doc.save();

                                    json_responses = requestGen.responseGenerator(200, {message: "ride created successfully", rideId: rideId });
                                    callback(null, json_responses);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.getRideInformation = function (msg, callback) {

	var json_responses;
	
	var customerId = msg.customerId;

	console.log("res "+customerId);
    Rides.find({customerId: customerId}, function(err, docs){
    	
    	console.log(docs+" docs");
    
    	if (docs.length > 0) {
    		console.log("inside docs");
            json_responses = requestGen.responseGenerator(200, docs);
        } else {
        	console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        }
        callback(null, json_responses);
    });
    
};


exports.updateRide = function (msg, callback) {

    var pickUpLocation = msg.pickUpLocation;
    var dropOffLocation = msg.dropOffLocation;
    var rideId = msg.rideId;

    var json_responses;

    Rides.findOneAndUpdate({rideId: rideId},
        {pickUpLocation: pickUpLocation, dropOffLocation: dropOffLocation},
        {new: true}, function (err, ride) {
            if (err) {
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            } else {
                if (ride != null) {
                    json_responses = requestGen.responseGenerator(200, ride);
                } else {
                    json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
                }
            }
            callback(null, json_responses);
        });
};

exports.deleteRide = function (msg, callback) {

    var rideId = msg.rideId;

    var json_responses;

    Rides.remove({rideId: rideId}, function (err,removed) {
        console.log(removed);
        if (err) {
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        } else {
            if(removed.result.n > 0 ) {
                json_responses = requestGen.responseGenerator(200, {message: 'Ride Deleted.'});
            }else{
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            }
        }
        callback(null, json_responses);
    });
};

exports.customerRideList = function(msg, callback){

    var customerId = msg.customerId;

    Rides.find({customerId : customerId},function(err,rides){
        var json_responses;
        if(err){
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        }else{
            if(rides.length > 0){
                json_responses = requestGen.responseGenerator(200, rides);
            }else{
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            }
        }
        callback(null,json_responses);
    });
};

exports.driverRideList = function(msg, callback){

    var driverId = msg.driverId;

    Rides.find({driverId : driverId},function(err,rides){
        var json_responses;
        if(err){
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        }else{
            if(rides.length > 0){
                json_responses = requestGen.responseGenerator(200, rides);
            }else{
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            }
        }
        callback(null,json_responses);
    });
};



exports.endRide = function(msg, callback){

    var dropOffLatLong = msg.dropOffLatLong;
    var dropOffLocation = msg.dropOffLocation;
    var driverId =  msg.driverId;
    var rideId = msg.rideId;

    var rideEndDateTime = new Date();

    var json_response;

    Rides.update({rideId: rideId}, {$set: {rideEndDateTime: rideEndDateTime}}, function(err, ride){
        if(err){
            json_response = requestGen.responseGenerator(500,{message: 'Error'} );
            callback(null, json_response);
        }
        else{
            if(ride.length > 0){

                var rideDoc = ride;

                Drivers.update({driId: driverId}, {$set: {isBusy: false, currentLocation: dropOffLocation}}, function(err, driver){

                    if(err){
                        json_response = requestGen.responseGenerator(500,{message: 'Error'} );
                        callback(null, json_response);
                    }
                    else{

                        if(driver.length > 0){
                            json_response = requestGen.responseGenerator(200, rideDoc);
                            callback(null, json_response);
                        }
                        else{
                            json_response = requestGen.responseGenerator(200,{message: 'No Driver Found'} );
                            callback(null, json_response);
                        }
                    }
                });
            }
            else{
                json_response = requestGen.responseGenerator(500,{message: 'No Ride Found'} );
                callback(null, json_response);
            }
        }
    });

};

exports.startRide = function(msg, callback){

    var rideId = msg.rideId;
    var driverId = msg.driverId;

    var json_response;

    Rides.findOne({rideId: rideId}, function(err, ride){
        if(err){
            json_response = requestGen.responseGenerator(500,{message: 'Error'} );
            callback(null, json_response);
        }
        else{
            if(ride.length > 0){
                ride.rideStarted = true;
                ride.rideStartDateTime = new Date();

                ride.save(function(err){

                    if(err){
                        json_response = requestGen.responseGenerator(500, {message: 'Error in Ride Saving'});
                        callback(null, json_response);
                    }
                    else{

                        Drivers.find({email: driverId}, function(err, driver){

                            if(err){
                                json_response = requestGen.responseGenerator(500, {message: 'Error in finding driver'});
                                callback(null, json_response);
                            }
                            else{
                                if(driver.length > 0){

                                    driver.isBusy = true;

                                    driver.save(function (err) {
                                        if(err){
                                            json_response = requestGen.responseGenerator(500, {message: 'Error in Driver Saving'});
                                            callback(null, json_response);
                                        }
                                        else{
                                            json_response = requestGen.responseGenerator(200, {message: 'Driver save success'});
                                            callback(null, json_response);
                                        }
                                    });
                                }
                                else{
                                    json_response = requestGen.responseGenerator(500, {message: 'No driver found'});
                                    callback(null, json_response);
                                }

                            }
                        });
                    }
                });
            }
            else{
                json_response = requestGen.responseGenerator(500, {message: 'No Ride Found'});
                callback(null, json_response);
            }
        }
    });
};




exports.getRideInfo = function (msg, callback) {

    var json_responses;

    var rideId = msg.rideId;

    //console.log("res "+customerId);
    Rides.findOne({rideId: rideId}, function(err, doc){

        //console.log(docs+" docs");

        if (doc.length > 0) {
            //console.log("inside docs");
            json_responses = requestGen.responseGenerator(200, doc);
        } else {
            console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        }
        callback(null, json_responses);
    });

};