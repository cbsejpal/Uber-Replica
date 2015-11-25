//customer
var customerSchema = require('./model/customerSchema');
var requestGen = require('./commons/responseGenerator');

var Customer = customerSchema.Customer; //mysql instance
var Customers = customerSchema.Customers; //mongoDB instance

exports.registerCustomer = function(msg, callback){

    var email = msg.email;
    var password = msg.password;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipCode = msg.zipCode;
    var phoneNumber = msg.phoneNumber;
    var creditCard = msg.creditCard;

    var json_responses;

    //add data in mysql
    Customer.create({
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
        creditCard: creditCard
    }).then(function(){
        //add data in mongodb
        var newCustomer = new Customers({
            firstName: firstName,
            lastName: lastName,
            email: email
        });

        newCustomer.save(function(err) {

            if (err) {
                json_responses = requestGen.responseGenerator(500, {message: " error registering customer" });
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: "customer registration successfull" });

            }
            callback(null, json_responses);
        });
    });

};

exports.loginCustomer = function(msg, callback){

    var email = msg.email;
    var password = msg.password;

    var json_responses;

    Customer.findOne({where: {email: email, password: password}}).then(function (user) {
        if(user){
            json_responses = requestGen.responseGenerator(200, {message: 'customer login successful', user: user.email});
        }
        else{
            json_responses = requestGen.responseGenerator(401, {message: 'customer login failed'});
        }
        callback(null, json_responses);
    });
};

exports.deleteCustomer = function(msg, callback){
    var email = msg.email;
    var json_responses;

    Customer.destroy({where: {email: email}}).then(function(){

        Customers.findOneAndRemove({email: email}, function(err){
            if(err){
                json_responses = requestGen.responseGenerator(500, {message: 'customer delete failed'});
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: 'customer delete successful'});
            }
            callback(null, json_responses);
        });
    });
};

exports.getCustomerInformation = function (msg, callback) {
    var customerId = msg.customerId;
    var json_responses;
    
    Customer.findOne({where: {email: customerId}}).then(function (customer) {
    	console.log("outside if");
        if (customer) {
        	console.log("inside if");
            Customers.find({custId: customerId}, function(err, customers){
                if(customers){
                	console.log("inside second if");
                    json_responses = requestGen.responseGenerator(200, customer, customers);
                }
                else{
                    json_responses = requestGen.responseGenerator(500, customer, {message: "No rides found!"});
                }
                callback(null, json_responses);
            });
        } else {
            json_responses = requestGen.responseGenerator(500, {message: "No Customers found"});
            callback(null, json_responses);
        }
        //callback(null, json_responses);
    });
};


exports.updateCustomer = function (msg, callback) {

    var email = msg.email;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var city = msg.city;
    var state = msg.state;
    var phoneNumber = msg.phoneNumber;
    var creditCard = msg.creditCard;

    var json_responses;
console.log(firstName);
    Customer.update({
        email: email,
        firstName: firstName,
        lastName: lastName,
        city: city,
        state : state,
        phoneNumber: phoneNumber,
        creditCard: creditCard
    }, {where: {email: email}}).then(function (customer) {

        if (customer) {
            Customers.update({email: email}, {$set: {firstName: firstName, lastName: lastName}}, function (err, customers) {
                if (customers) {
                    Customer.findOne({where: {email: email}}).then(function (customer) {
                        var json_responses;
                        if (customer) {
                            json_responses = requestGen.responseGenerator(200, customer);
                        } else {
                            json_responses = requestGen.responseGenerator(500, {message: "No Customer found"});
                        }
                        callback(null, json_responses)
                    });
                }
                else {
                    json_responses = requestGen.responseGenerator(500, {message: "Customer Not found"});
                    callback(null, json_responses);
                }
            });
        }
    });
};

exports.listAllCustomers = function(msg, callback){

    var json_responses;

    Customer.findAll().then(function(customers){
        if(customers.length > 0){
            json_responses = requestGen.responseGenerator(200, {data: customers});
        }
        else{
            json_responses = requestGen.responseGenerator(404, {data: 'Sorry no customers found'});
        }
        callback(null, json_responses);
    });
};

exports.addImagesToRide = function(msg, callback){

    var json_responses;

    var image = msg.image;

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var conn = mongoose.createConnection('mongodb://localhost:27017/uber');
    var fs = require('fs');

    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    conn.once('open', function () {
        console.log('open');
        var gfs = Grid(conn.db);

        // streaming to gridfs
        //filename to store in mongodb
        var writestream = gfs.createWriteStream({
            filename: 'newFile.jpg'
        });
        fs.createReadStream(image).pipe(writestream);

        writestream.on('close', function (file) {
            // do something with `file`
            console.log(file.filename + 'Written To DB');
            json_responses = requestGen.responseGenerator(200, "Written to DB");
            callback(null, json_responses);
        });
    });
};

exports.getImagesOfRide = function(msg, callback){

    var json_responses;

    json_responses = requestGen.responseGenerator(200, null);
    callback(null, json_responses);
};