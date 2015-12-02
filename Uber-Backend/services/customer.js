//customer
var customerSchema = require('./model/customerSchema');
var requestGen = require('./commons/responseGenerator');

var Customer = customerSchema.Customer; //mysql instance
var Customers = customerSchema.Customers; //mongoDB instance
var crypto = require('crypto');

exports.registerCustomer = function(msg, callback){

    var email = msg.email;
    var password = msg.password;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var ssn = msg.ssn;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipCode = msg.zipCode;
    var phoneNumber = msg.phoneNumber;
    var creditCard = msg.creditCard;

    var salt = "!@12MySeCrEtSALTsTrInG!@12";
    var newPassword = crypto.createHash('sha512').update(salt + password + salt).digest("hex");

    var json_responses;

    //add data in mysql
    Customer.create({
        //id - autoIncrement by default by sequelize
        email: email,
        password: newPassword,
        firstName: firstName,
        lastName: lastName,
        ssn: ssn,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        phoneNumber: phoneNumber,
        creditCard: creditCard
    }).then(function(customer){
        //add data in mongodb
        var newCustomer = new Customers({
            custId: customer.customer_id,
            firstName: firstName,
            lastName: lastName,
            email: email
        });

        //console.log("customer id: " +customer.customer_id);

        newCustomer.save(function(err) {

            if (err) {
                json_responses = requestGen.responseGenerator(500, {message: " error registering customer" });
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: "customer registration successfull" });

            }
            callback(null, json_responses);
        });
    });

};

exports.loginCustomer = function(msg, callback){

    var email = msg.email;
    var password = msg.password;


    var salt = "!@12MySeCrEtSALTsTrInG!@12";
    var newPassword = crypto.createHash('sha512').update(salt + password + salt).digest("hex");

    var json_responses;

    Customer.findOne({attributes: ['email', 'password'], where: {email: email, password: newPassword}}).then(function (user) {
        if(user){
            json_responses = requestGen.responseGenerator(200, {message: 'customer login successful', user: user.email});
        }
        else{
            json_responses = requestGen.responseGenerator(401, {message: 'customer login failed'});
        }
        callback(null, json_responses);
    });
};

exports.deleteCustomer = function(msg, callback){
    var email = msg.email;
    var json_responses;

    Customer.destroy({where: {email: email}}).then(function(){

        Customers.findOneAndRemove({email: email}, function(err){
            if(err){
                json_responses = requestGen.responseGenerator(500, {message: 'customer delete failed'});
            }
            else {
                json_responses = requestGen.responseGenerator(200, {message: 'customer delete successful'});
            }
            callback(null, json_responses);
        });
    });
};

exports.getCustomerInformation = function (msg, callback) {
    var customerId = msg.customerId;
    var json_responses;

    Customer.findOne({where: {email: customerId}}).then(function (customer) {
        //console.log("outside if");
        if (customer) {
            //console.log("inside if");
            Customers.find({email: customerId}).then(function(err, customers){
                if(customers){
                    console.log("inside second if");
                    json_responses = requestGen.responseGenerator(200, customer, customers);
                }
                else{
                    json_responses = requestGen.responseGenerator(200, customer, {message: "No rides found!"});
                }
                callback(null, json_responses);
            }) ;
        } else {
            json_responses = requestGen.responseGenerator(500, {message: "No Customers found"});
            callback(null, json_responses);
        }
        //callback(null, json_responses);
    });
};


exports.updateCustomer = function (msg, callback) {

    var email = msg.email;
    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var city = msg.city;
    var state = msg.state;
    var phoneNumber = msg.phoneNumber;
    var creditCard = msg.creditCard;
    var zipCode = msg.zipCode;

    var json_responses;
    console.log(firstName);
    Customer.update({
        email: email,
        firstName: firstName,
        lastName: lastName,
        city: city,
        state : state,
        zipCode: zipCode,
        phoneNumber: phoneNumber,
        creditCard: creditCard
    }, {where: {email: email}}).then(function (customer) {

        if (customer) {
            Customers.update({email: email}, {$set: {firstName: firstName, lastName: lastName}}, function (err, customers) {
                if (customers) {
                    Customer.findOne({where: {email: email}}).then(function (customer) {
                        var json_responses;
                        if (customer) {
                            json_responses = requestGen.responseGenerator(200, customer);
                        } else {
                            json_responses = requestGen.responseGenerator(500, {message: "No Customer found"});
                        }
                        callback(null, json_responses)
                    });
                }
                else {
                    json_responses = requestGen.responseGenerator(500, {message: "Customer Not found"});
                    callback(null, json_responses);
                }
            });
        }
    });
};

exports.listAllCustomers = function(msg, callback){

    var json_responses;


    Customer.findAll().then(function(customers){
        if(customers.length > 0){
            json_responses = requestGen.responseGenerator(200, {data: customers});
        }
        else{
            json_responses = requestGen.responseGenerator(404, {data: 'Sorry no customers found'});
        }
        callback(null, json_responses);
    });
};

exports.addImagesToRide = function(msg, callback){

    var json_responses;

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var conn = mongoose.createConnection('mongodb://localhost:27017/neuber');
    var fs = require('fs');

    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    var dirname = require('path').dirname(__dirname);
    var filename = msg.filename;
    var path = msg.path;
    var type = msg.type;

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

            json_responses = requestGen.responseGenerator(200, "Written to DB");
            callback(null, json_responses);
            //res.redirect('/');
        });
    });
};

exports.getImagesOfRide = function(msg, callback){

    var json_responses;

    var billId = msg.billId;

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var conn = mongoose.createConnection('mongodb://localhost:27017/neuber');
    var fs = require('fs');

    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    conn.once('open', function () {
        console.log('open');
        console.log('image name ' + billId+'.jpg');
        var gfs = Grid(conn.db);


        var dirname = msg.dirname;
        var newPath = dirname + "/uploads/"+billId+'.jpg';

        var options = {filename : billId+'.jpg'};

        gfs.exist(options, function (err, found) {
            if (err) {
                console.log(err);
            }
            else{
                if(found){
                    var writestream = fs.createWriteStream(newPath);

                    gfs.createReadStream({
                        filename: billId+'.jpg'
                    }).pipe(writestream);

                    json_responses = requestGen.responseGenerator(200, null);
                    callback(null, json_responses);
                }
                else{
                    json_responses = requestGen.responseGenerator(404, null);
                    callback(null, json_responses);
                }
            }
        });

    });

};

exports.checkCustomerEmail = function(msg, callback){

    var email = msg.email;

    var json_response;

    Customer.findAll({where: {email: email}}).then(function(customers){

        //console.log("email customers " + customers);

        if(customers.length > 0){
            json_response = requestGen.responseGenerator(500, null);
        }
        else{
            json_response = requestGen.responseGenerator(200, null);
        }

        callback(null, json_response);
    });
};


exports.getCustomerRating = function(msg, callback){
    var emailId = msg.emailId;
    var json_response;

    console.log(emailId);
    Customers.findOne( { email : emailId }, function(err, doc) {

        console.log(doc);
        if (err) {
            console.log("error getting ratings");
            json_response = requestGen.responseGenerator(401, null);
            callback(null, json_response);
        }

        else {
            if (doc) {
                var custRating = [];
                var total = 0;
                var count = doc.rides.length;
                var newCount = 0;;
                for (var i = 0; i < count; i++) {
                    //console.log(i + " " + doc.rides[i].rating);
                    if(typeof (doc.rides[i].rating) != 'undefined'){
                        //console.log("new i" + i);

                        total += doc.rides[i].rating;
                        newCount++;
                    }
                }
                //console.log("total " + total);
                Avg = total/newCount;
                //console.log("avg " + Avg );
                //console.log("number " + Number(Avg).toFixed(1));
                json_response = requestGen.responseGenerator(200,{data: Number(Avg).toFixed(1)});
                callback(null, json_response);
            }
        }
    });
};

exports.searchCustomer = function (msg, callback) {

    var search = msg.search;
    var offset = msg.startPosition;

    Customer.findAll({
        where: {
            $or: [{
                email: {$like: '%' + search + '%'}
            }, {
                firstName: {$like: '%' + search + '%'}
            }, {
                lastName: {$like: '%' + search + '%'}
            }, {
                address: {$like: '%' + search + '%'}
            }, {
                city: {$like: '%' + search + '%'}
            }, {
                state: {$like: '%' + search + '%'}
            }, {
                zipCode: {$like: '%' + search + '%'}
            }, {
                phoneNumber: {$like: '%' + search + '%'}
            }, {
                ssn: {$like: search}
            }
            ]
        }
        ,order:[['customer_id', 'ASC']], offset: offset,limit: 50}).then(function (customers) {
        var json_responses;
        if (customers) {
            json_responses = requestGen.responseGenerator(200, customers);
        }
        else {
            json_responses = requestGen.responseGenerator(500, {message: 'No driver details found.'});
        }
        callback(null, json_responses);
    });
};

exports.checkCustomerSSN = function(msg, callback){

    var ssn = msg.ssn;

    var json_response;

    Customer.findAll({where: {ssn: ssn}}).then(function(customers){

        //console.log("email customers " + customers);

        if(customers.length > 0){
            json_response = requestGen.responseGenerator(500, null);
        }
        else{
            json_response = requestGen.responseGenerator(200, null);
        }

        callback(null, json_response);
    });
};