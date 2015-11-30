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

exports.customerRegistertationFailed = function(req,res){

    res.render('failedCustomer');

};

exports.checkCustomerEmail = function(req, res){

    var email = req.param('email');

    var msg_payload = {
        email: email,
        "func" : "checkCustomerEmail"
    }

    var json_responses;

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
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


exports.loginCustomer = function(req, res){

    var json_responses;
    var email = req.param('email');
    var password = req.param('password');

    //Valdidations
    if(email==undefined || password==undefined){
        console.log("loginCustomer Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0 && password.length > 0 ) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("loginCustomer email validation entry error");
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }


            console.log("loginCustomer validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
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
        }
    }
};

exports.registerCustomer = function(req, res){

    var email = req.param('email');
    var password = req.param('password');
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var ssn = req.param('ssn');
    var address = req.param('address');
    var city = req.param('city');
    var state = req.param('state');
    var zipCode = req.param('zipCode');
    var phoneNumber = req.param('phoneNumber');
    var creditCard = req.param('creditCard');

    //Valdidations
    if(email==undefined || password==undefined || firstName==undefined
        || lastName==undefined || zipCode==undefined || phoneNumber==undefined){
        console.log("registerCustomer Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{
        if( ! (email.length > 0 && password.length > 0 && firstName.length > 0
            && lastName.length > 0 && zipCode.length > 0 && phoneNumber.length > 0) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("registerCustomer email validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            if( !( (new RegExp("/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/")).test(zipCode) ) ){

                console.log("registerCustomer zipcode validation entry error" );
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            if( !( (new RegExp("/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/")).test(phoneNumber) ) ){

                console.log("registerCustomer phoneNumber validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            console.log("registerCustomer validation entry error" );
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
                "ssn" : ssn,
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
        }
    }

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

    //Valdidations
    if(firstName==undefined || lastName==undefined || zipCode==undefined || phoneNumber==undefined
        || state==undefined || city==undefined || creditCard==undefined){
        console.log("updateCustomer Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (firstName.length > 0 && lastName.length > 0 && zipCode.length > 0 && phoneNumber.length > 0
            && state.length>0 && city.length>0 && creditCard>0) ){

            if( !( (new RegExp("/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/")).test(zipCode) ) ){

                console.log("updateCustomer zipcode validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            if( !( (new RegExp("/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/")).test(phoneNumber) ) ){

                console.log("updateCustomer phoneNumber validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            console.log("updateCustomer validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }
    }


};


exports.deleteCustomer = function(req, res){

    var email = req.param('email');

    //Valdidations
    if(email==undefined){
        console.log("deleteCustomer Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0 ) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("deleteCustomer email validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            console.log("deleteCustomer validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }
    }

};

exports.deleteSelfCustomer = function(req, res){

    var email = req.session.customerId;

    //Valdidations
    if(email==undefined){
        console.log("deleteCustomer Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (email.length > 0 ) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(email) ) ){

                console.log("deleteCustomer email validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            console.log("deleteCustomer validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }
    }
    req.session.destroy();
    res.redirect('/');

};


exports.getCustomerInformation = function(req, res){
    var customerId = req.session.customerId;
    console.log("get customer info " + customerId);

    //Valdidations
    if(customerId==undefined){
        console.log("getCustomerInfo Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (customerId.length > 0) ){

            console.log("getCustomerInfo validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{

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
        }
    }

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

exports.searchCustomer =  function(req, res){

    var search = req.param('search');
    var startPosition = req.param('startPosition');

    var msg_payload = {
        "startPosition" : startPosition,
        "search":search,
        "func" : "searchCustomer"
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


exports.renderAddImagesToRide = function(req, res){
  res.render('addImagesToRide');
};

exports.addImagesToRide = function(req, res){

//    var image = req.param('image');

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

    //console.log("files " + req.files);

    var dirname = require('path').dirname(__dirname);
    var filename = req.files.file.name;
    var path = req.files.file.path;
    var type = req.files.file.mimetype;

    conn.once('open', function () {
        console.log('open');
        var gfs = Grid(conn.db);

        // streaming to gridfs
        //filename to store in mongodb
        //var writestream = gfs.createWriteStream(dirname + '/' + path);

        /*    {
            filename: 'newFile1.jpg'
        });*/

        var writestream = gfs.createWriteStream({
            filename: filename
        });

        fs.createReadStream(path).pipe(writestream);

       // var read_stream =  fs.createReadStream(dirname + '/' + path);


        //read_stream.pipe(writestream);

        writestream.on('close', function (file) {
            // do something with `file`
            console.log(file.filename + 'Written To DB');
            //json_responses = requestGen.responseGenerator(200, "Written to DB");
            //callback(null, json_responses);
            res.redirect('/');
        });
    });

    /*var fs = require('fs');

    var dirname = require('path').dirname(__dirname);

    var filename = req.files.file.name;

    fs.readFile(req.files.file.path, function (err, data) {
        // ...
        var newPath = dirname + "/uploads/"+filename;
        fs.writeFile(newPath, data, function (err) {
            res.redirect('/');
        });
    });*/
};

exports.getImagesOfRide = function (req, res) {

    var image = req.param('image');

/*    //Valdidations
    if( ! (image) ){

    //Valdidations
    if(image==undefined){

        console.log("getImagesOfRide parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{

        if( ! (image) ){

            console.log("getImagesOfRide validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
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
        console.log('image name ' + image);
        var gfs = Grid(conn.db);


        //var dirname = require('path').dirname(__dirname);
        //var newPath = dirname + "/uploads/lol1.jpg";

        //var writestream = fs.createWriteStream(newPath);


        //var str = image.substring(1, image.length);

        res.contentType('image/png');

        //console.log("str " + str);
        gfs.createReadStream({
            //_id: '5649b270c73c2e4c1746f9ca'
            filename: image
            //_id: '565c1f1c3d4803e82c5d0830'
        }).pipe(res);

        /*writestream.on('close', function (file) {
            res.redirect('/');
        });*/
    });
};


exports.getCustomerRating = function(req, res){
    var emailId = req.param('emailId');

    //Validations
    if(emailId==undefined){
        console.log("getCustomerRating Parameters are not valid!" );
        res.status(500);
        json_responses = {"statusCode":500,"Request":"Invalid"};
        res.send(json_responses);
    }
    else{

        if( ! (emailId.length > 0 ) ){

            if( !( (new RegExp("/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/")).test(emailId) ) ){

                console.log("getCustomerRating email validation entry error" );
                res.status(500);
                json_responses = {"statusCode":500};
                res.send(json_responses);
            }

            console.log("getCustomerRating validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "emailId": emailId,
                "func" : "getCustomerRating"
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

        }

    }

};

exports.customerRideBill = function(req, res){

    var bill = req.param('bill');

    res.render('customerRideBill', {bill: bill});
};

exports.getImage = function(req, res){
    res.render('getImage');
};