//driver
var driverSchema = require('./model/driverSchema');
var requestGen = require('./commons/responseGenerator');

var Driver = driverSchema.Driver; //mysql instance
var Drivers = driverSchema.Drivers; //mongoDB instance

exports.registerDriver = function(msg, callback){

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
        phoneNumber: phoneNumber,
        carDetails: carDetails
    }).then(function(){
        //add data in mongodb
        var newDriver = new Drivers({
            firstName: firstName,
            lastName: lastName
        });

        newDriver.save(function(err) {

            if (err) {
                json_responses = requestGen.responseGenerator(500, {message: "error registering driver" });
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: "driver registration successfull" });
            }
            callback(null, json_responses);
        });

    });

};


exports.loginDriver = function(msg, callback){

    var email = msg.email;
    var password = msg.password;

    var json_responses;

    Driver.findOne({where: {email: email, password: password}}).then(function (user) {

        if(user){
            json_responses = requestGen.responseGenerator(200, {message: 'driver login successful', user: user.email});
        }
        else{
            json_responses = requestGen.responseGenerator(401, {message: 'driver login failed'});
        }
        callback(null, json_responses);
    });

};
