//rides

var rideSchema = require('./model/rideSchema');
var customerSchema = require('./model/customerSchema');
var driverSchema = require('./model/driverSchema');
var requestGen = require('./commons/responseGenerator');

var request = require('request');
var _ = require('underscore');

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

    var rideDateTime = new Date();


    var newRide = new Rides({
        pickUpLocation: pickUpLocation,
        dropOffLocation: dropOffLocation,
        pickUpLatLong: pickUpLatLong,
        dropOffLatLong: dropOffLatLong,
        rideDateTime: rideDateTime,
        //rideStartDateTime: rideStartDateTime,
        customerId: customerId,
        driverId: driverId
    });

    var json_responses;

    var rideId;


    //console.log("customer email" + customerId);
    //console.log("driver email " + driverId);

    Customers.findOne({email: customerId, verifyStatus: true}, function (err, customer) {
        if (err) {
            json_responses = requestGen.responseGenerator(500, {message: "Customer not found or customer isn't approved"});
            callback(null, json_responses);
        }
        else {

            console.log("customer " + JSON.stringify(customer));

            if (customer) {

                Drivers.findOne({email: driverId, isBusy: false}, function (err, driver) {

                    if (err) {
                        json_responses = requestGen.responseGenerator(500, {message: "Sorry Driver Not found or busy right now."});
                        callback(null, json_responses);
                    }
                    else {

                        if (driver) {

                            newRide.save(function (err) {


                                Rides.findOne({
                                    $and: [{customerId: customerId}, {driverId: driverId}, {rideDateTime: rideDateTime}]
                                }, function (err, ride) {
                                    if (err) {
                                        json_responses = requestGen.responseGenerator(500, {message: " error finding rideId"});
                                        callback(null, json_responses);
                                    }
                                    else {
                                        rideId = ride.rideId;

                                        customer.rides.push({
                                            rideId: rideId
                                        });
                                        customer.save();


                                        driver.rides.push({
                                            rideId: rideId
                                        });
                                        driver.currentRideId = rideId;
                                        driver.save();

                                        json_responses = requestGen.responseGenerator(200, {
                                            message: "Ride created successfully",
                                            rideId: rideId
                                        });

                                        var fs = require('fs');

                                        var dirname = "../Uber-Client";
                                        var newPath = dirname + "/uploads/"+driverId+'.jpg';

                                        fs.unlinkSync(newPath);

                                        callback(null, json_responses);
                                    }
                                });

                            });
                        }
                        else {
                            json_responses = requestGen.responseGenerator(500, {message: "Driver Not found or busy right now."});
                            callback(null, json_responses);
                        }
                    }

                });
            }
            else {
                json_responses = requestGen.responseGenerator(500, {message: "Customer not verified or not found."});
                callback(null, json_responses);
            }
        }
    });
};

exports.getRideInformation = function (msg, callback) {

    var json_responses;

    var customerId = msg.customerId;

    console.log("res " + customerId);
    Rides.find({customerId: customerId}, function (err, docs) {

        console.log(docs + " docs");

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

    Rides.remove({rideId: rideId}, function (err, removed) {
        console.log(removed);
        if (err) {
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        } else {
            if (removed.result.n > 0) {
                json_responses = requestGen.responseGenerator(200, {message: 'Ride Deleted.'});
            } else {
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            }
        }
        callback(null, json_responses);
    });
};

exports.customerRideList = function (msg, callback) {

    var customerId = msg.customerId;

    Rides.find({customerId: customerId}, function (err, rides) {
        var json_responses;
        if (err) {
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        } else {
            if (rides.length > 0) {
                json_responses = requestGen.responseGenerator(200, rides);
            } else {
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            }
        }
        callback(null, json_responses);
    });
};

exports.driverRideList = function (msg, callback) {

    var driverId = msg.driverId;

    Rides.find({driverId: driverId}, function (err, rides) {
        var json_responses;
        if (err) {
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        } else {
            if (rides.length > 0) {
                json_responses = requestGen.responseGenerator(200, rides);
            } else {
                json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
            }
        }
        callback(null, json_responses);
    });
};


exports.endRide = function (msg, callback) {

    var dropOffLatLong = msg.dropOffLatLong;
    var dropOffLocation = msg.dropOffLocation;
    var driverId = msg.driverId;
    var rideId = msg.rideId;

    var rideEndDateTime = new Date();

    var json_response;


    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json', //URL to hit
        qs: {address: dropOffLocation},
        method: 'GET'
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {

            var city = findResult(JSON.parse(body).results[0].address_components, "locality");
            var location = JSON.parse(body).results[0].geometry.location;

            var latitude = location.lat;
            var longitude = location.lng;


            Rides.findOne({rideId: rideId}, function (err, ride) {
                if (err) {
                    json_response = requestGen.responseGenerator(500, {message: 'Error'});
                    callback(null, json_response);
                }
                else {

                    if (ride) {

                        ride.rideEndDateTime = rideEndDateTime;
                        ride.rideCity = city;
                        ride.save(function (err) {
                            var rideDoc = ride;

                            Drivers.update({email: driverId}, {
                                $set: {
                                    isBusy: false,
                                    currentLocation: dropOffLocation,
                                    latitude: latitude,
                                    longitude: longitude,
                                    currentRideId: ""
                                }
                            }, function (err, driver) {

                                if (err) {
                                    json_response = requestGen.responseGenerator(500, {message: 'Error Occurred!'});
                                    callback(null, json_response);
                                }
                                else {

                                    console.log(JSON.stringify(driver));

                                    if (driver) {
                                        json_response = requestGen.responseGenerator(200, rideDoc);
                                        callback(null, json_response);
                                    }
                                    else {
                                        json_response = requestGen.responseGenerator(500, {message: 'No Driver Found'});
                                        callback(null, json_response);
                                    }
                                }
                            });
                        });
                    }
                    else {
                        json_response = requestGen.responseGenerator(500, {message: 'No Ride Found'});
                        callback(null, json_response);
                    }
                }
            });
        }
    });


};

exports.startRide = function (msg, callback) {

    var rideId = msg.rideId;
    var driverId = msg.driverId;

    var json_response;

    Rides.findOne({rideId: rideId}, function (err, ride) {
        if (err) {
            json_response = requestGen.responseGenerator(500, {message: 'Error'});
            callback(null, json_response);
        }
        else {
            if (ride) {
                ride.rideStarted = true;
                ride.rideStartDateTime = new Date();

                ride.save(function (err) {

                    if (err) {
                        json_response = requestGen.responseGenerator(500, {message: 'Error in Ride Saving'});
                        callback(null, json_response);
                    }
                    else {

                        Drivers.findOne({email: driverId}, function (err, driver) {

                            console.log(driver);

                            if (err) {
                                json_response = requestGen.responseGenerator(500, {message: 'Error in finding driver'});
                                callback(null, json_response);
                            }
                            else {
                                if (driver) {

                                    driver.isBusy = true;

                                    driver.save(function (err) {
                                        if (err) {
                                            json_response = requestGen.responseGenerator(500, {message: 'Enable to start ride'});
                                            callback(null, json_response);
                                        }
                                        else {
                                            json_response = requestGen.responseGenerator(200, {message: 'Ride Started successfully.'});
                                            callback(null, json_response);
                                        }
                                    });
                                }
                                else {
                                    json_response = requestGen.responseGenerator(500, {message: 'No driver found'});
                                    callback(null, json_response);
                                }

                            }
                        });
                    }
                });
            }
            else {
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
    Rides.findOne({rideId: rideId}, function (err, doc) {

        if (doc) {
            //console.log("inside docs");
            json_responses = requestGen.responseGenerator(200, doc);
        } else {
            console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found'});
        }
        callback(null, json_responses);
    });

};

exports.rateDriver = function (msg, callback) {

    var json_responses;

    var emailId = msg.emailId;
    var rideId = msg.rideId;
    var rating = msg.rating;
    var reviews = msg.reviews;

    Drivers.findOne({email: emailId}, function (err, doc) {
        console.log("Doc " + doc);

        doc.rides.push({
            rideId: rideId,
            rating: rating,
            reviews: reviews
        });

//        console.log("Doc " + doc);
        doc.save(function (err) {
            var json_response;
            if (err) {
                json_response = requestGen.responseGenerator(401, null);
            } else {
                json_response = requestGen.responseGenerator(200, null);
            }
            callback(null, json_response);
        });
    });
};

exports.rateCustomer = function (msg, callback) {

    var emailId = msg.emailId;
    var rideId = msg.rideId;
    var rating = msg.rating;
    var reviews = msg.reviews;

    Customers.findOne({email: emailId}, function (err, doc) {

        doc.rides.push({
            rideId: rideId,
            rating: rating,
            reviews: reviews
        });

        doc.save(function (err) {
            var json_response;
            if (err) {
                json_response = requestGen.responseGenerator(401, null);
            } else {
                json_response = requestGen.responseGenerator(200, null);
            }
            callback(null, json_response);
        });
    });
};


var findResult = function (results, name) {
    var result = _.find(results, function (obj) {
        return obj.types[0] == name && obj.types[1] == "political";
    });
    return result ? result.short_name : null;
};



exports.cityList = function(msg, callback){

    var json_responses;

    Rides.find({}, function(err, docs){
        //console.log(docs + " docs");

        if (docs.length > 0) {
            //console.log("inside docs");

            var cityList = [];

            docs.forEach(function(doc){
                if(!_.contains(cityList, doc.rideCity)){
                    cityList.push(doc.rideCity);
                }
            });

            json_responses = requestGen.responseGenerator(200, cityList);
        } else {
            //console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No City Found'});
        }
        callback(null, json_responses);
    });
};

exports.cityRides = function(msg, callback){

    var rideCity = msg.rideCity;

    var json_responses;
    Rides.find({rideCity: rideCity}, function(err, docs){
        //console.log(docs + " docs");

        if (docs.length > 0) {
            //console.log("inside docs");
            json_responses = requestGen.responseGenerator(200, docs);
        } else {
            //console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No Cities Found'});
        }
        callback(null, json_responses);
    });
};

exports.driverRides = function(msg, callback){

    var driverId = msg.driverId;
    var json_responses;
    Rides.find({driverId: driverId}, function(err, docs){
        //console.log(docs + " docs");

        if (docs.length > 0) {
            //console.log("inside docs");
            json_responses = requestGen.responseGenerator(200, docs);
        } else {
            //console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found with driver Id'});
        }
        callback(null, json_responses);
    });
};

exports.customerRides = function(msg, callback){

    var customerId = msg.customerId;
    var json_responses;
    Rides.find({customerId: customerId}, function(err, docs){
        //console.log(docs + " docs");

        if (docs.length > 0) {
            //console.log("inside docs");
            json_responses = requestGen.responseGenerator(200, docs);
        } else {
            //console.log("error");
            json_responses = requestGen.responseGenerator(500, {message: 'No Ride Found with customer Id'});
        }
        callback(null, json_responses);
    });
};
