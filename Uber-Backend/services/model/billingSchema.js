//creating billing model

var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://localhost:27017/uber");
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

//create billing and related schema using mongoose

var billingSchema = new Schema({
	billingId: {type: String, required: true},
	rideId: {type: String, required: true},
	rideDate:{type: Date, required: true}, 
	pickUpLocation: {type: String, required: true},
	dropOffLocation: {type: String, required: true},
	rideStartTime: {type: Date, required: true},
	rideEndTime: {type: Date, required: true},
	rideDistance: {type: String, required: true},
	customerId: {type: String, required: true},
	driverId: {type: String, required: true},
	rideAmount: {type: Number, required: true}
}, {
	versionKey : false
});

//create Billings model from schema
var Billings = mongoose.model('Billings', billingSchema);

billingSchema.plugin(autoIncrement.plugin, {
	model: 'Billings',
	field: 'billingId',
	startAt: 1,
	incrementBy: 1
});

exports.Billings = Billings;