//driver
var driverSchema = require('./model/driverSchema');
var requestGen = require('./commons/responseGenerator');
var request = require('request');
var _ = require('underscore');

var Driver = driverSchema.Driver; //mysql instance
var Drivers = driverSchema.Drivers; //mongoDB instance

exports.registerDriver = function (msg, callback) {

    var email = msg.email;
    var password = msg.password;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipCode = msg.zipCode;
    var phoneNumber = msg.phoneNumber;
//    var carDetails = msg.carDetails;

    var json_responses;

    //add data in mysql
    Driver.create({
        //id - autoIncrement by default by sequelize
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        phoneNumber: phoneNumber
 //       carDetails: carDetails
    }).then(function () {
        //add data in mongodb
        var newDriver = new Drivers({
            firstName: firstName,
            lastName: lastName,
            email: email
        });

        newDriver.save(function (err) {

            if (err) {
                json_responses = requestGen.responseGenerator(500, {message: "error registering driver"});
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: "driver registration successfull"});
            }
            callback(null, json_responses);
        });

    });

};


exports.loginDriver = function (msg, callback) {

    var email = msg.email;
    var password = msg.password;

    var json_responses;

    Driver.findOne({where: {email: email, password: password}}).then(function (user) {

        if (user) {
            json_responses = requestGen.responseGenerator(200, {message: 'driver login successful', user: user.email});
        }
        else {
            json_responses = requestGen.responseGenerator(401, {message: 'driver login failed'});
        }
        callback(null, json_responses);
    });

};

exports.searchDriver = function (msg, callback) {

    var search = msg.search;

    Driver.find({
        where: {
            $or: [{
                email: {$like: '%' + search + '%'}
            }, {
                firstName: {$like: '%' + search + '%'}
            }, {
                lastName: {$like: '%' + search + '%'}
            }, {
                address: {$like: '%' + search + '%'}
            }, {
                city: {$like: '%' + search + '%'}
            }, {
                state: {$like: '%' + search + '%'}
            }, {
                zipCode: {$like: '%' + search + '%'}
            }, {
                phoneNumber: {$like: '%' + search + '%'}
            }, {
                carDetails: {$like: '%' + search + '%'}
            }
            ]
        }
    }).then(function (drivers) {
        var json_responses;
        if (drivers) {
            json_responses = requestGen.responseGenerator(200, drivers);
        }
        else {
            json_responses = requestGen.responseGenerator(500, {message: 'No driver details found.'});
        }
        callback(null, json_responses);
    });
};

exports.deleteDriver = function (msg, callback) {
    var email = msg.email;
    var json_responses;
    console.log(email + " email");
    Driver.destroy({where: {email: email}}).then(function (affectedRows) {
                if (affectedRows > 0) {
                	console.log("first if");
                    Drivers.remove({email: email}, function (err, removed) {
                        if (err) {
                            json_responses = requestGen.responseGenerator(500, {message: 'driver delete failed'});
                        }
                        else {
                            if (removed.result.n > 0) {
                            	console.log("last if");
                            	json_responses = requestGen.responseGenerator(200, {message: 'Driver Deleted.'});
                            } else {
                            	console.log("first else");
                                json_responses = requestGen.responseGenerator(500, {message: 'No Driver Found'});
                            }
                        }
                        callback(null, json_responses);
                    });
                } else {
                	console.log("last else");
                    json_responses = requestGen.responseGenerator(500, {message: 'No Driver Found'});
                    callback(null, json_responses);
                }
            });
};

exports.getDriverInformation = function (msg, callback) {
    var email = msg.email;
    var json_responses;
    console.log(email);
    Driver.findOne({where: {email: email}}).then(function (driver) {
    console.log(email);
        if (driver) {
        	console.log("driver from sql " + driver);
        	
            Drivers.find({email: email}, function(err, drivers){
                if(drivers){
                	console.log("driver from mongodb " + drivers);
                	
                    json_responses = requestGen.responseGenerator(200, driver, drivers);
                }
                else{
                    json_responses = requestGen.responseGenerator(500, driver, {message: "No rides found!"});
                }
                callback(null, json_responses);
            });
        } else {
            json_responses = requestGen.responseGenerator(500, {message: "No Driver found"});
        }
        //callback(null, json_responses);
    });
};



exports.updateDriver = function (msg, callback) {

    var email = msg.email;
    var password = msg.password;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipCode = msg.zipCode;
    var phoneNumber = msg.phoneNumber;
    var carDetails = msg.carDetails;

    var json_responses;

    Driver.update({
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        phoneNumber: phoneNumber,
        carDetails: carDetails
    }, {where: {email: email}}).then(function (driver) {

        if (driver) {
            Drivers.update({email: email}, {$set: {firstName: firstName, lastName: lastName}}, function (err, drivers) {
                if (drivers) {
                    Driver.findOne({where: {email: email}}).then(function (driver) {
                        var json_responses;
                        if (driver) {
                            json_responses = requestGen.responseGenerator(200, driver);
                        } else {
                            json_responses = requestGen.responseGenerator(500, {message: "No Driver found"});
                        }
                        callback(null, json_responses)
                    });
                }
                else {
                    json_responses = requestGen.responseGenerator(500, {message: "Driver Not found"});
                    callback(null, json_responses);
                }
            });
        }
    });
};

exports.updateDriverDetails = function(msg, callback){

    var email = msg.email;
    var vehicleType = msg.vehicleType;
    var numberPlate = msg.numberPlate;
    var license = msg.license;
    var currentLocation = msg.currentLocation;

    //var profilePhoto = msg.profilePhoto;
    var videoURL = msg.videoURL;

    var carDetails =
        "Car Type: " + vehicleType + "  Car Number: " + numberPlate;

    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json', //URL to hit
        qs: {address: "750 Miller st San Jose"},
        method: 'GET'
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, JSON.parse(body));
            var city = findResult(JSON.parse(body).results[0].address_components, "locality");
            var location = JSON.parse(body).results[0].geometry.location;
            console.log("city", city);
            console.log("location", location);
        }
    });

    Driver.update({
        carDetails: carDetails,
        videoURL: videoURL,
        license: license
    },{where: {email: email}}).then(function(driver){
        var json_responses;
        if (driver) {

            Drivers.update({email: email}, {$set: {currentLocation: currentLocation}},  function(err, doc){

                if(err){
                    json_responses = requestGen.responseGenerator(500, {message: "Error saving driver"});
                    callback(null, json_responses);
                }

                else if(doc.length > 0){
                    json_responses = requestGen.responseGenerator(200, {message: 'Success'});
                    callback(null, json_responses);
                }
                else{
                    json_responses = requestGen.responseGenerator(500, {message: "No Driver found in MongoDB"});
                    callback(null, json_responses);
                }
            });
        } else {
            json_responses = requestGen.responseGenerator(500, {message: "No Driver found"});
            callback(null, json_responses);
        }

    });
};

var findResult = function(results, name){
    var result =  _.find(results, function(obj){
        return obj.types[0] == name && obj.types[1] == "political";
    });
    return result ? result.short_name : null;
};