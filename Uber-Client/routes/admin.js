
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

    //Validations

    if(email==undefined || password==undefined || firstName==undefined
        || lastName==undefined || zipCode==undefined || phoneNumber==undefined || securityCode==undefined){
        console.log("registerAdmin Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0 && password.length > 0 && firstName.length > 0
            && lastName.length > 0 && zipCode.length > 0 && phoneNumber.length > 0 && securityCode.length>0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("registerAdmin email validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            if( !( (new RegExp("/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/")).test(zipCode) ) ){

                console.log("registerAdmin zipcode validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            if( !( (new RegExp("/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/")).test(phoneNumber) ) ){

                console.log("registerAdmin phoneNumber validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            console.log("registerAdmin validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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


        }


    }




};

exports.loginAdmin = function(req, res){

    var email = req.param('email');
    var password = req.param('password');

    //Validations
    if(email==undefined || password==undefined){
        console.log("loginAdmin Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0 && password.length > 0 ) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("loginAdmin email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("loginAdmin validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }


    }




};

exports.showDrivers = function(req, res){
	
	var email = req.param('email');

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

	var startPosition = req.param('startPosition');

    //Validations
    if(startPosition==undefined){
        console.log("showCustomers Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (startPosition.length > 0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("showCustomers email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("showCustomers validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

            var msg_payload = {
                "startPosition" : startPosition,
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
        }
    }




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

    //Validations
    if(email==undefined){
        console.log("verifyDrivers Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("verifyDrivers email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("verifyDrivers validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }

    }

};

exports.verifyCustomers =  function(req, res){

    var email = req.param('email');

    //Validations
    if(email==undefined){
        console.log("verifyCustomers Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("verifyCustomers email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("verifyCustomers validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }
    }

};


exports.ignoreDrivers =  function(req, res){

    var email = req.param('email');
    console.log(email);


    //Validations
    if(email==undefined){
        console.log("ignoreDrivers Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("ignoreDrivers email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("ignoreDrivers validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

            var msg_payload = {
                "email": email,
                "func" : "ignoreDrivers"
            };

            mq_client.make_request('admin_queue', msg_payload, function(err,results) {
                console.log(JSON.stringify(results)+" drivers data");
                if (err) {
                    res.status(500).send(null);
                } else {
                    res.status(200).send(results);
                }
            });
        }
    }

};

exports.ignoreCustomers =  function(req, res){

    var email = req.param('email');

    //Validations
    if(email==undefined){
        console.log("ignoreCustomers Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("ignoreCustomers email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("ignoreCustomers validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

            var msg_payload = {
                "email": email,
                "func" : "ignoreCustomers"
            };

            console.log(email);
            mq_client.make_request('admin_queue', msg_payload, function(err,results) {
                console.log(results+" customers data");
                if (err) {
                    res.status(500).send(null);
                } else {
                    console.log("about results" + results);
                    res.status(200).send(results);
                }
            });
        }
    }

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
            console.log("revenue results" + JSON.stringify(results));
            res.status(results.status).send(results.data);
        }
    });
};