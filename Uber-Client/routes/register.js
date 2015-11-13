//register user into db

var customerSchema = require('./model/customerSchema');
var driverSchema = require('./model/driverSchema');
var adminSchema = require('./model/adminSchema');

var Customer = customerSchema.Customer; //mysql instance
var Customers = customerSchema.Customers; //mongoDB instance
var Driver = driverSchema.Driver; //mysql instance
var Drivers = driverSchema.Drivers; //mongoDB instance
var Admin = adminSchema.Admin;

exports.registerCustomer = function(req, res){

	var email = req.param('email');
	var password = req.param('password');
	var firstName = req.param('firstName');
	var lastName = req.param('lastName');
	var address = req.param('address');
	var city = req.param('city');
	var state = req.param('state');
	var zipCode = req.param('zipCode');
	var phoneNumber = req.param('phoneNumber');
	var creditCard = req.param('creditCard');

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
				res.send(500, {message: " error registering customer" });
			}
			else {
				res.send(200, {message: "customer registration successfull" });

			}
		});  
	});

};

exports.registerDriver = function(req, res){

	var email = req.param('email');
	var password = req.param('password');
	var firstName = req.param('firstName');
	var lastName = req.param('lastName');
	var address = req.param('address');
	var city = req.param('city');
	var state = req.param('state');
	var zipCode = req.param('zipCode');
	var phoneNumber = req.param('phoneNumber');
	var carDetails = req.param('carDetails');

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
				res.send(500, {message: "error registering driver" });
			}
			else {
				res.send(200, {message: "driver registration successfull" });

			}
		});

	});

};

exports.registerAdmin = function(req, res){

	var email = req.param('email');
	var password = req.param('password');
	var firstName = req.param('firstName');
	var lastName = req.param('lastName');
	var address = req.param('address');
	var city = req.param('city');
	var state = req.param('state');
	var zipCode = req.param('zipCode');
	var phoneNumber = req.param('phoneNumber');

	var securityCode = req.param('securityCode');

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
			res.send(200, {message: "admin registration successfull" });  
		});
	}
	else{
		res.send(401, {message: "you are not authorized to register as Admin" });  
	}
};