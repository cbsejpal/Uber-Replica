
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.index = function (req,res){
	
	res.render('signupDriver');

};

exports.driverDashboard =  function(req,res){
	
	res.render('driverDashboard');

};


exports.login = function(req,res){
	
	res.render('loginDriver');

};


exports.firstLogIn = function(){
	res.render('driverLogin', {title: "Login"});
};

exports.driverDetails = function(req, res){
	res.render('driverDetails', {title: "Driver Details"});
};


exports.registerDriver = function(req, res){

	var json_responses;
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
        "carDetails" : carDetails,
        "func" : "registerDriver"
    };

    //add data in mysql
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
           json_responses = {"statusCode" : 401};
           res.send("json_responses");
        	
        } else {
            ////console.log("about results" + results);
        	json_responses = {"statusCode" : results.status};
            res.send("json_responses");
        }
    });

};

exports.loginDriver = function(req, res){
	var json_responses;
    var email = req.param('email');
    var password = req.param('password');

    var msg_payload = {
        "email" : email,
        "password" : password,
        "func" : "loginDriver"
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            json_responses = {"statusCode" : 401};
            res.send(json_responses);

        } else {
            ////console.log("about results" + results);
        	
			if(req.param("firstLogIn") == "yes"){
				res.render("driverDetails", { title: 'Uber - Add Driver Information' });
			}
			else{
				json_responses = {"statusCode" : results.status};
				res.send(json_responses);				
			}
            
            
        }
    });
};

exports.searchDriver = function(req, res){

    var search = req.param('search');

    var msg_payload = {
        "search" : search,
        "func" : "searchDriver"
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
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

exports.deleteDriver = function(req, res){

    var email =  req.param('email');

    var msg_payload = {
        "email": email,
        "func" : "deleteDriver"
    };


    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
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

exports.getDriverInformation = function(req, res){
    var email =  req.param('email');

    var msg_payload = {
        "email": email,
        "func" : "getDriverInformation"
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
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

exports.updateDriver = function(req,res){

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
        "carDetails" : carDetails,
        "func" : "updateDriver"
    };

    //add data in mysql
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
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