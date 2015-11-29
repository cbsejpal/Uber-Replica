
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');


exports.index = function (req,res){

    res.render('signupCustomer');

};

exports.customerDashboard =  function(req,res){

    if(req.session.customerId){
        res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('customerDashboard');
    }
    else{
        res.redirect('/');
    }


};


exports.login = function(req,res){

    res.render('loginCustomer');

};

exports.errorCustomer = function(req,res){

    res.render('errorCustomer');

};

exports.loginCustomer = function(req, res){

    var json_responses;
    var email = req.param('email');
    var password = req.param('password');

    var msg_payload = {
        "email" : email,
        "password" : password,
        "func" : "loginCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            json_responses = {"statusCode" : 401};
            res.send(json_responses);

        } else {

            //console.log("results user " + JSON.stringify(results) );
            //console.log("about results" + results["user"]);
            req.session.customerId =  results.data.user;
            //console.log("session " + req.session.customerId);
            //res.status(results.status).send(results.data);
            json_responses = {"statusCode" : results.status};
            res.send(json_responses);

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

            json_responses = {"statusCode" : results.status};
            res.send(json_responses);

        }
    });
};


exports.updateCustomer = function(req,res){

    var customerId = req.session.customerId;

    //var email = req.param('email');
    // var password = req.param('password');
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var state = req.param('state');
    var city = req.param('city');
    var phoneNumber = req.param('phoneNumber');
    console.log(req.param('firstName'));
    var creditCard = req.param('creditCard');
    var zipCode = req.param('zipCode');

    var msg_payload = {
        "email" : customerId,
        "firstName" : firstName,
        "lastName" : lastName,
        "city" : city,
        "state" : state,
        "phoneNumber" : phoneNumber,
        "creditCard" : creditCard,
        "zipCode" : zipCode,
        "func" : "updateCustomer"
    };

    //add data in mysql
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        }
        else {

            json_responses = {"statusCode" : results.status};
            req.session.customerId = results.data.email;
            res.send(json_responses);

        }
    });
};


exports.deleteCustomer = function(req, res){

	var email = req.param('email');

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
        	
            res.send(results);
        }
    });
};

exports.getCustomerInformation = function(req, res){
    var customerId = req.session.customerId;
    console.log("get customer info " + customerId);

    var msg_payload = {
        "customerId": customerId,
        "func" : "getCustomerInformation"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        console.log(results.data);
        if (err) {
            console.log(err);
            res.status(500).send(null);

        } else {
            //console.log("about results");

            res.send(results);
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

exports.addImagesToRide = function(req, res){

    var image = req.param('image');

    /*var msg_payload = {
     image: image,
     "func" : "addImagesToRide"
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
     });*/

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
            filename: 'newFile1.jpg'
        });
        fs.createReadStream(image).pipe(writestream);

        writestream.on('close', function (file) {
            // do something with `file`
            console.log(file.filename + 'Written To DB');
            //json_responses = requestGen.responseGenerator(200, "Written to DB");
            //callback(null, json_responses);
        });
    });
};

exports.getImagesOfRide = function (req, res) {

    var image = req.param('image');

    var msg_payload = {
        "func" : "getImagesOfRide"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        //console.log(results);
        if (err) {
            //console.log(err);
            res.status(500).send(null);
        } else {
            //console.log("about results" + results);

            var mongoose = require('mongoose');
            var Schema = mongoose.Schema;

            var conn = mongoose.createConnection('mongodb://localhost:27017/uber');
            var fs = require('fs');

            var Grid = require('gridfs-stream');
            Grid.mongo = mongoose.mongo;

            conn.once('open', function () {
                console.log('open');
                console.log('image name' + image);
                var gfs = Grid(conn.db);

                gfs.createReadStream({
                    //"filename": image
                    _id: '5649b270c73c2e4c1746f9ca'
                }).pipe(res);
            });

            //res.status(results.status).send(results.data);
        }
    });

};