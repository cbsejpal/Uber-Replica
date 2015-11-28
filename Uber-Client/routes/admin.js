
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.adminDashboard =  function(req,res){

    console.log("dashboard " + req.session.adminId);
    if(req.session.adminId){
        res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('adminDashboard');
    }
    else{
        res.redirect('/');
    }
};

exports.login = function(req, res){
    res.render('loginAdmin');
};

exports.register = function (req, res) {
    res.render('registerAdmin');
}


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
            //console.log("about results" + JSON.stringify(results));
            req.session.adminId =  results.data.user;
            //console.log("login " + req.session.adminId);
            res.status(results.status).send(results.data);
        }
    });
};

exports.showDrivers = function(req, res){
	
	email = req.param('email');
    var msg_payload = {
    	"email" : email,
        "func" : "showDrivers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        console.log(results+" Data for drivers");
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
        	
            res.status(200).send(results);
        }
    });
};

exports.showDriversForApproval =  function(req, res){

	var email = req.param('email');
    var msg_payload = {
    		"email" : email,
        "func" : "showDriversForApproval"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        console.log("drivers : "+results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("about results" + results);
            res.status(200).send(results);
        }
    });
};



exports.showCustomers =  function(req, res){

	var email = req.param('email');
    var msg_payload = {
    		"email" : email,
        "func" : "showCustomers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        console.log("customers  : "+JSON.stringify(results));
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("about results" + results);
            res.status(200).send(results);
        }
    });
};

exports.showCustomersForApproval =  function(req, res){

	var email = req.param('email');
    var msg_payload = {
    		"email" : email,
        "func" : "showCustomersForApproval"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        console.log("customers  : "+results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("about results" + results);
            res.status(200).send(results);
        }
    });
};


exports.verifyDrivers =  function(req, res){

    var email = req.param('email');
    console.log(email);
    var msg_payload = {
        "email": email,
        "func" : "verifyDrivers"
    };

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        console.log(JSON.stringify(results)+" drivers data");
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            res.status(200).send(results);
        }
    });
};

exports.verifyCustomers =  function(req, res){

    var email = req.param('email');
    var msg_payload = {
        "email": email,
        "func" : "verifyCustomers"
    };
    
    console.log(email);	
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        console.log(results+" customers data");
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            console.log("about results" + results);
            res.status(200).send(results);
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