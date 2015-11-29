
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

exports.index = function (req,res){

    res.render('signupDriver');

};

exports.driverDashboard =  function(req,res){

    if(req.session.driverId){
        res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('driverDashboard');
    }

    else{
        res.redirect('/');
    }
};


exports.login = function(req,res){

    res.render('loginDriver');

};


exports.errorDriver = function(req,res){

    res.render('errorDriver');

};

exports.driverRegistertationFailed = function(req,res){

    res.render('failedDriver');

};

exports.driverLogin = function(req,res){

    res.render('driverLogin');

};

exports.checkDriverEmail = function(req, res){

    var email = req.param('email');

    var msg_payload = {
        email: email,
        "func" : "checkDriverEmail"
    }

    var json_responses;

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            res.send(500);

        } else {
            ////console.log("about results" + results);
            json_responses = {"status" : results.status};
            res.send(json_responses);
        }
    });

};


exports.driverDetails = function(req, res){

    if(req.session.driverId){
        res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('driverDetails', {title: "Driver Details"});
    }
    else{
        res.redirect('/');
    }
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
//    var carDetails = req.param('carDetails');


    //Valdidations
    if( ! (email.length > 0 && password.length > 0 && firstName.length > 0
        && lastName.length > 0 && zipCode.length > 0 && phoneNumber.length > 0) ){

        if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

            console.log("registerDriver email validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        if( !( (new RegExp("/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/")).test(zipCode) ) ){

            console.log("registerDriver zipcode validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        if( !( (new RegExp("/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/")).test(phoneNumber) ) ){

            console.log("registerDriver phoneNumber validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        console.log("registerDriver validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }


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
  //      "carDetails" : carDetails,
        "func" : "registerDriver"
    };

    //add data in mysql
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            res.send(500);

        } else {
            ////console.log("about results" + results);
            json_responses = {"statusCode" : results.status};
            res.send(json_responses);
        }
    });

};

exports.loginDriver = function(req, res){
    var json_responses;
    var email = req.param('email');
    var password = req.param('password');

    //Valdidations
    if( ! (email.length > 0 && password.length > 0 ) ){

        if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

            console.log("loginDriver email validation entry error");
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }


        console.log("loginDriver validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }

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
            	 req.session.driverId =  results.data.user;

             	console.log(req.session.driverId);
                 json_responses = {"statusCode" : results.status};
                res.send(json_responses);
            }


        }
    });
};

exports.searchDriver = function(req, res){

    var search = req.param('search');

    //Valdidations
    if( ! (search) ){

        console.log("searchDriver validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }

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
            res.status(results.status).send(results);
        }
    });
};

exports.deleteDriver = function(req, res){
	
	var email = req.param('email');
	console.log("email"+email);

    //Valdidations
    if( ! (email.length > 0 ) ){

        if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

            console.log("deleteDriver email validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        console.log("deleteDriver validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }

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
            res.send(results);
        }
    });
};

exports.getDriversInRange = function(req, res){

    var currentLat = req.param('currentLat');
    var currentLng = req.param('currentLng');

    //Valdidations
    if( !currentLat && !currentLng ){

        console.log("getDriversInRange validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }


    var msg_payload = {
      "func" : "getDriversInRange",
        "currentLat" : currentLat,
        "currentLng" : currentLng
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        //console.log("Results from get driver info :"+results);
        if (err) {
         
            res.status(500).send(null);
        } else {
            //console.log("These are the results from driver info :" + results);
            res.status(200).send(results);
        }
    });
};



exports.getDriverInformation = function(req, res){
    var email =  req.session.driverId;
    
    //console.log("get driverinfo session "+ email);
    //Valdidations
    if( ! (email.length > 0 ) ){

        if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

            console.log("getDriverInformation email validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        console.log("getDriverInformation validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }


    var msg_payload = {
        "email": email,
        "func" : "getDriverInformation"
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        //console.log("Results from get driver info :"+results);
        if (err) {
            //console.log(err);
        //	console.log("error");
            res.status(500).send(null);
        } else {
            //console.log("These are the results from driver info :" + results);
            res.status(200).send(results);
        }
    });
};

exports.updateDriver = function(req,res){
	
	var firstName = req.param('firstName');

	var lastName = req.param('lastName');

	var state = req.param('state');
	var email = req.param('email');
    var zipCode = req.param('zipCode');
	var city = req.param('city');
	
	var phoneNumber = req.param('phoneNumber');

	var carDetails = req.param('carDetails');


    //Valdidations
    if( ! (email.length > 0 && password.length > 0 && firstName.length > 0
        && lastName.length > 0 && zipCode.length > 0 && phoneNumber.length > 0) ){

        if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

            console.log("updateDriver email validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        if( !( (new RegExp("/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/")).test(zipCode) ) ){

            console.log("updateDriver zipcode validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        if( !( (new RegExp("/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/")).test(phoneNumber) ) ){

            console.log("updateDriver phoneNumber validation entry error" );
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }

        console.log("updateDriver validation entry error" );
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }

    var msg_payload = {
    		
    	"firstName" : firstName,
        "lastName" : lastName,
    	"email" : email,
    	"city" : city,
    	"state" : state,
        "phoneNumber" : phoneNumber,
        "carDetails" : carDetails,
        "zipCode" : zipCode,
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


exports.updateDriverDetails = function(req, res){

    var email = req.session.driverId;
    var vehicleType = req.param('vehicleType');
    var numberPlate = req.param('numberPlate');
    var license = req.param('license');
    //var profilePhoto = req.param('profilePhoto');
    var videoURL = req.param('videoURL');
    var currentLocation = req.param('currentLocation');

    var msg_payload = {
        "email" : email,
        "vehicleType": vehicleType,
        "numberPlate": numberPlate,
        "license": license,
        "videoURL": videoURL,
        //profilePhoto: profilePhoto
        "currentLocation" : currentLocation,
        "func": "updateDriverDetails"
    };

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            ////console.log("about results" + results);
            res.send(results);
        }
    });
};