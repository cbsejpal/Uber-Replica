
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');


exports.index = function (req,res){
	
	res.render('signupCustomer');

};

exports.login = function(req,res){
	
	res.render('loginCustomer');

};
exports.loginCustomer = function(req, res){

    var email = req.param('email');
    var password = req.param('password');

    var msg_payload = {
        "email" : email,
        "password" : password,
        "func" : "loginCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            req.session.customerId =  results.user;
            res.status(results.status).send(results.data);
        }
    });
};

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

    var msg_payload = {
        "email" : email,	
        "password" : password,
        "firstName" : firstName,
        "lastName" : lastName,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipCode" : zipCode,
        "phoneNumber" : phoneNumber,
        "creditCard" : creditCard,
        "func" : "registerCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            res.status(results.status).send(results.data);
        }
    });
};

exports.deleteCustomer = function(req, res){

    var email =  req.param('email');

    var msg_payload = {
        "email": email,
        "func" : "deleteCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            res.status(results.status).send(results.data);
        }
    });
};


exports.listAllCustomers =  function(req, res){

    var msg_payload = {
        "func" : "listAllCustomers"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            res.status(results.status).send(results.data);
        }
    });
};