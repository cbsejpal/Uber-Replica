//rides
var mq_client = require('../rpc/client');
var requestGen = require('./commons/responseGenerator');

var io = require('./socket');

exports.createRide = function (req, res) {

    var pickUpLocation = req.param('pickUpLocation');
    var dropOffLocation = req.param('dropOffLocation');
    var pickUpLatLong = req.param('pickUpLatLong');
    var dropOffLatLong = req.param('dropOffLatLong');
    //var rideStartDateTime = new Date();
    var customerId = req.session.customerId;
    var driverId = req.param('driverId');

    //Valdidations
    if(pickUpLatLong==undefined || pickUpLocation==undefined || dropOffLatLong==undefined
        || dropOffLocation==undefined || customerId==undefined || driverId==undefined){
        console.log("createRide parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! ( pickUpLocation.length > 0 && dropOffLocation.length > 0 && pickUpLatLong.length > 0
            && dropOffLatLong.length > 0 && customerId.length > 0 && driverId.length>0 ) ){
            console.log("createRide validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "pickUpLocation": pickUpLocation,
                "dropOffLocation": dropOffLocation,
                "pickUpLatLong": pickUpLatLong,
                "dropOffLatLong": dropOffLatLong,
                //"rideStartDateTime" : rideStartDateTime,
                "customerId": customerId,
                "driverId": driverId,
                "func": "createRide"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
                //console.log(results);
                if (err) {
                    //console.log(err);
                    res.status(500).send(null);
                } else {
                    ////console.log("about results" + results);
                    io.onInformationretrieved(driverId,results.data.rideId);
                    console.log("Emit: ", driverId);
                    res.status(results.status).send(results.data);
                }
            });
        }
    }

};

exports.getRideInformation = function (req, res) {
    var customerId = req.session.customerId;
    console.log(customerId);
    //var customerId = req.session.customerId;
    //req.session.customerId;
    //console.log("Rides info :"+customerId);

    //Valdidations
    if(customerId==undefined){
        console.log("getRideInformation parameter error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! (customerId) ){
            console.log("getRideInformation validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "customerId": customerId,
                "func": "RideInfo"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
                console.log("results for rides " + JSON.stringify(results));

                if (err) {
                    //console.log(err);
                    res.status(500).send(null);
                } else {

                    ////console.log("about results" + results);
                    res.send(results);
                }
            });
        }
    }

};

exports.updateRide = function (req, res) {
    var pickUpLocation = req.param('pickUpLocation');
    var dropOffLocation = req.param('dropOffLocation');
    var rideId = req.param('rideId');

    //Validations
    if(pickUpLocation==undefined || dropOffLocation==undefined || rideId==undefined){
        console.log("updateRide parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! ( pickUpLocation.length > 0 && dropOffLocation.length > 0 && rideId.length > 0) ){


            console.log("updateRide validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "pickUpLocation": pickUpLocation,
                "dropOffLocation": dropOffLocation,
                "rideId": rideId,
                "func": "updateRide"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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

exports.deleteRide = function (req, res) {
    var rideId = req.param('rideId');

    //Validations
    if(rideId==undefined){
        console.log("deleteRide parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! ( rideId.length > 0) ){
            console.log("deleteRide validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "rideId": rideId,
                "func": "deleteRide"
            };
            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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

exports.customerRideList = function (req, res) {
    var customerId = req.param('customerId');

    //Validations
    if(customerId==undefined){
        console.log("customerRideList parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! (customerId.length > 0) ){

            console.log("customerRideList validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "customerId": customerId,
                "func": "customerRideList"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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

exports.driverRideList = function (req, res) {
    var driverId = req.session.driverId;
    //console.log("driverRideList function : " + driverId);

    //Validations
    if(driverId==undefined){
        console.log("driverRideList parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! (driverId.length > 0) ){
            console.log("driverRideList validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "driverId": driverId,
                "func": "driverRideList"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
                //console.log(results);
                if (err) {

                    res.status(500).send(null);
                } else {
                    console.log(results);
                    res.send(results);
                }
            });
        }
    }

};

exports.endRide = function (req, res) {

    var dropOffLatLong = req.param('dropOffLatLong');
    var dropOffLocation = req.param('dropOffLocation');
    var rideId = req.param('rideId');

    var driverId = req.session.driverId;

    //Validations
    if(driverId==undefined || dropOffLatLong==undefined || dropOffLocation==undefined || rideId==undefined){
        console.log("endRide parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! (dropOffLatLong.length>0 && dropOffLocation.length>0 && driverId.length > 0 && rideId.length>0) ){
            console.log("endRide validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "rideId": rideId,
                dropOffLatLong: dropOffLatLong,
                dropOffLocation: dropOffLocation,
                "driverId": driverId,
                "func": "endRide"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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

exports.startRide = function (req, res) {

    var rideId = req.param('rideId');
    var driverId = req.session.driverId;

    //Validations
    if(driverId==undefined || rideId==undefined){
        console.log("startRide parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( !  (driverId.length > 0 && rideId.length>0) ){

            console.log("startRide validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "rideId": rideId,
                "driverId":driverId,
                "func": "startRide"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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

exports.getRideInfo = function (req, res) {

    var rideId = req.param('rideId');

    //Validations
    if(rideId==undefined){
        console.log("getRideInfo parameters error" );
        res.status(500);
        json_responses = {"statusCode":500};
        res.send(json_responses);
    }
    else{
        if( ! (rideId.length > 0) ){
            console.log("getRideInfo validation entry error" );
            res.status(500);
            json_responses = {"statusCode":500};
            res.send(json_responses);
        }
        else{
            var msg_payload = {
                "rideId": rideId,
                "func": "getRideInfo"
            };

            mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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

exports.rateDriver = function (req, res) {

    var emailId = req.param('driverId');
    var rideId = req.param('rideId');
    var rating = req.param('rating');
    var reviews = req.param('reviews');

    var msg_payload = {
        "rideId": rideId,
        "emailId": emailId,
        "rating": rating,
        "reviews": reviews,
        "func": "rateDriver"
    };

    mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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


exports.rateCustomer = function (req, res) {

    var emailId = req.param('customerId');
    var rideId = req.param('rideId');
    var rating = req.param('rating');
    var reviews = req.param('reviews');

    var msg_payload = {
        "rideId": rideId,
        "emailId": emailId,
        "rating": rating,
        "reviews": reviews,
        "func": "rateCustomer"
    };

    mq_client.make_request('ride_queue', msg_payload, function (err, results) {
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