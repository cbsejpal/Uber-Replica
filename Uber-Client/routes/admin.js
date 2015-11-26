
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.adminDashboard =  function(req,res){
	
	res.render('adminDashboard');

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
        "securityCode" : securityCode,
        "func" : "registerAdmin"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
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

exports.loginAdmin = function(req, res){

    var email = req.param('email');
    var password = req.param('password');

    var msg_payload = {
        "email" : email,
        "password" : password,
        "func" : "loginAdmin"
    };

        mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            req.session.adminId =  results.user;
            res.status(results.status).send(results.data);
        }
    });
};

exports.showDrivers = function(req, res){

    var msg_payload = {
        "func" : "showDrivers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
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

exports.showCustomers =  function(req, res){

    var msg_payload = {
        "func" : "showCustomers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("about results" + results);
            res.status(results.status).send(results.data);
        }
    });
};



exports.verifyDrivers =  function(req, res){

    var email = req.param('email');
    var msg_payload = {
        "email": email,
        "func" : "verifyDrivers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
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

exports.verifyCustomers =  function(req, res){

    var email = req.param('email');
    var msg_payload = {
        "email": email,
        "func" : "verifyCustomers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("about results" + results);
            res.status(results.status).send(results.data);
        }
    });
};

exports.revenuePerDayWeekly = function(req,res){
    var msg_payload = {
        "func" : "revenuePerDayWeekly"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("revenue results" + results);
            res.status(results.status).send(results.data);
        }
    });
};
