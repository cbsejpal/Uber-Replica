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
    var rideDateTime = new Date();
    var customerId = msg.customerId;
    var driverId = msg.driverId;

    var newRide = new Rides({
        pickUpLocation: pickUpLocation,
        dropOffLocation: dropOffLocation,
        rideDateTime: rideDateTime,
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
                rideDateTime: rideDateTime,
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

                                    json_responses = requestGen.responseGenerator(200, {message: "ride created successfully"});
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

    var rideId = msg.rideId;

    var json_responses;

    Rides.findOne({rideId: rideId}).then(function (ride) {
        if (ride) {
            json_responses = requestGen.responseGenerator(200, ride);
        } else {
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