//admin
var adminSchema = require('./model/adminSchema');
var customerSchema = require('./model/customerSchema');
var driverSchema = require('./model/driverSchema');
var requestGen = require('./commons/responseGenerator');
var billingsSchema = require('./model/billingSchema');

var Admin = adminSchema.Admin;
var Customer = customerSchema.Customer; //mysql instance
var Customers = customerSchema.Customers; //mongoDB instance
var Driver = driverSchema.Driver; //mysql instance
var Drivers = driverSchema.Drivers; //mongoDB instance
var Billings = billingsSchema.Billings;


exports.registerAdmin = function(msg, callback){

    var email = msg.email;
    var password = msg.password;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipCode = msg.zipCode;
    var phoneNumber = msg.phoneNumber;

    var securityCode = msg.securityCode;

    var json_responses;
    if(securityCode === "mySeCrEtCoDe"){
        Admin.create({
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
        }).then(function(){
            json_responses = requestGen.responseGenerator(200, {message: "admin registration successful" });
            callback(null, json_responses);
        });
    }
    else{
        json_responses = requestGen.responseGenerator(401, {message: "you are not authorized to register as Admin" });
        callback(null, json_responses);
    }
};

exports.loginAdmin = function(msg, callback){

    var email = msg.email;
    var password = msg.password;

    var json_responses;

    Admin.findOne({where: {email: email, password: password}}).then(function (user) {

        if(user){

            json_responses = requestGen.responseGenerator(200, {message: 'admin login successful', user: user.email});
        }
        else{
            json_responses = requestGen.responseGenerator(401, {message: 'admin login failed'});
        }
        callback(null, json_responses);
    });

};


exports.showCustomers = function(msg, callback){

    var json_responses;
    Customer.findAll({where: {verifyStatus:1}}).then(function(customers){
        if(customers.length > 0){
            json_responses = requestGen.responseGenerator(200, {data: customers});
        }
        else{
            json_responses = requestGen.responseGenerator(404, {data: 'Sorry no customers found'});
        }
        callback(null, json_responses);
    });
};


exports.showCustomersForApproval = function(msg, callback){

    var json_responses;
    Customer.findAll({where: {verifyStatus:0}}).then(function(customers){
        if(customers.length > 0){
            json_responses = requestGen.responseGenerator(200, {data: customers});
        }
        else{
            json_responses = requestGen.responseGenerator(404, {data: 'Sorry no customers found'});
        }
        callback(null, json_responses);
    });
};





exports.showDrivers = function (msg, callback) {

    var json_responses;
    Driver.findAll({where: {verifyStatus:1}}).then(function(driver) {
        if (driver.length > 0) {
            json_responses = requestGen.responseGenerator(200, {data: driver});
        } else {
            json_responses = requestGen.responseGenerator(500, {data: "No Driver found"});
        }
        callback(null, json_responses);
    });
};

exports.showDriversForApproval = function (msg, callback) {

    var json_responses;
    Driver.findAll({where: {verifyStatus:0}}).then(function(driver) {
        if (driver.length > 0) {
            json_responses = requestGen.responseGenerator(200, {data: driver});
        } else {
            json_responses = requestGen.responseGenerator(500, {data: "No Driver found"});
        }
        callback(null, json_responses);
    });
};

exports.verifyDrivers = function (msg, callback) {

    var email = msg.email;

    var json_responses;

    Driver.update({verifyStatus: true}, {where: {email: email}}).then(function(driver){
        if(driver){
            Drivers.update({email: email}, {$set: {verifyStatus: true}}, function (err, drivers) {
                if (drivers) {
                    json_responses = requestGen.responseGenerator(200, {data: "Driver Verified"});
                } else {
                    json_responses = requestGen.responseGenerator(500, {data: "Driver Not Verified"});
                }
                callback(null, json_responses)
            });
        }
        else {
            json_responses = requestGen.responseGenerator(500, {message: "No Driver found"});
            callback(null, json_responses);
        }
    });
};

exports.verifyCustomers = function (msg, callback) {

    var email = msg.email;

    var json_responses;

    Customer.update({verifyStatus: true}, {where: {email: email}}).then(function(customer){
        if(customer){
        Customers.update({email: email}, {$set: {verifyStatus: true}}, function (err, customers) {
            if (customers) {
                json_responses = requestGen.responseGenerator(200, {data: "Customer Verified"});
            } else {
                json_responses = requestGen.responseGenerator(500, {data: "Customer Not Verified"});
            }
            callback(null, json_responses)
        });
        }
        else {
            json_responses = requestGen.responseGenerator(500, {message: "No Customer found"});
            callback(null, json_responses);
        }

    });
};