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
            lastName: lastName
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

    Customer.findOneAndDelete({where: {email: email}}).success(function(){

        Customers.remove({email: email}, function(err){
            if(err){
                json_responses = requestGen.responseGenerator(401, {message: 'customer delete failed'});
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: 'customer delete successful'});
            }
            callback(null, json_responses);
        });
    });
};