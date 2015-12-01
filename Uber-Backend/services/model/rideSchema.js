//creating ride model

var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://localhost:27017/neuber");
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);


//create ride and related schema using mongoose

var rideSchema = new Schema({
	rideId: {type: String, required: true},
	pickUpLocation: {type: String, required: true},
	pickUpLatLong: {type: String, required: true},
	dropOffLocation: {type: String, required: true},
	dropOffLatLong: {type: String, required: true},
	rideStartDateTime: {type: Date},
	rideEndDateTime: {type: Date},
	customerId: {type: String, required: true},
	driverId: {type: String, required: true},
	rideStarted: {type: Boolean, default: false},
	rideDateTime: {type: Date},
	rideCity: {type: String}
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