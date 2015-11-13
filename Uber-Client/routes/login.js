//login

var customerSchema = require('./model/customerSchema');
var driverSchema = require('./model/driverSchema');
var adminSchema = require('./model/adminSchema');

var Customer = customerSchema.Customer; //mysql instance
var Customers = customerSchema.Customers; //mongoDB instance
var Driver = driverSchema.Driver; //mysql instance
var Drivers = driverSchema.Drivers; //mongoDB instance
var Admin = adminSchema.Admin;

exports.loginCustomer = function(req, res){

	var email = req.param('email');
	var password = req.param('password');

	Customer.findOne({where: {email: email, password: password}}).then(function (user) {
		if(user){
			req.session.customerId =  user.id;
			res.send(200, {message: 'customer login successful'});
		}
		else{
			res.send(401, {message: 'customer login failed'});
		}
	});
};

exports.loginDriver = function(req, res){

	var email = req.param('email');
	var password = req.param('password');

	Driver.findOne({where: {email: email, password: password}}).then(function (user) {
		if(user){
			req.session.driverId =  user.id;
			res.send(200, {message: 'driver login successful'});
		}
		else{
			res.send(401, {message: 'driver login failed'});
		}
	});

};

exports.loginAdmin = function(req, res){

	var email = req.param('email');
	var password = req.param('password');

	Admin.findOne({where: {email: email, password: password}}).then(function (user) {
		if(user){
			req.session.adminId =  user.id;
			res.send(200, {message: 'admin login successful'});
		}
		else{
			res.send(401, {message: 'admin login failed'});
		}
	});

};