//creating ride model

var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://localhost:27017/uber");
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);


//create ride and related schema using mongoose

var rideSchema = new Schema({
	rideId: {type: String, required: true},
	pickUpLocation: {type: String, required: true},
	dropOffLocation: {type: String, required: true},
	rideDateTime: {type: Date, required: true},
	customerId: {type: String, required: true},
	driverId: {type: String, required: true}
}, {
	versionKey : false
});

//create Rides model from schema
var Rides = mongoose.model('Rides', rideSchema);

rideSchema.plugin(autoIncrement.plugin, {
	model: 'Rides',
	field: 'rideId',
	startAt: 1,
	incrementBy: 1
});

exports.Rides = Rides;