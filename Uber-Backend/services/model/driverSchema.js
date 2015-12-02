//creating driver model

//mysql
var mysql = require('../mysql');
var Sequelize = require('sequelize');
var sequelize = mysql.sequelize;

var Driver = sequelize.define('Driver', {
	driver_id: {type: Sequelize.INTEGER(9).ZEROFILL, autoIncrement: true, primaryKey: true},
	email: {type: Sequelize.STRING, unique: true},
	password: Sequelize.TEXT,
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	ssn: Sequelize.STRING,
	address: Sequelize.STRING,
	city: Sequelize.STRING,
	state: Sequelize.STRING,
	zipCode: Sequelize.STRING,
	phoneNumber: Sequelize.STRING,
	carDetails: Sequelize.TEXT,
	license: Sequelize.STRING,
	videoURL: Sequelize.STRING,
	verifyStatus: {type: Sequelize.BOOLEAN, defaultValue: false},
	isIgnored: {type: Sequelize.BOOLEAN, defaultValue: false}
},{
	timestamps: false, //by default sequelize will add createdAt and updatedAt columns into tables so to remove them use this attribute
	freezeTableName: true //by default sequelize will create customerS table and not customer so this attribute won't allow it to plural the table name
});

Driver.sync();

exports.Driver = Driver;


//mongodb
var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://localhost:27017/neuber");
var Schema = mongoose.Schema;
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(connection);

//create driver and related schema using mongoose

var ridesList = new Schema({
	rideId : {
		type: String, 
		required: true
	},
	rating: Number,
	reviews: String

}, {
	_id : false
});

var driverSchema = new Schema({
	driId: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	rides: [ridesList],
	imagePath: String,
	//videoPath: String,
	verifyStatus: {type: Boolean, default: false},
	isIgnored: {type: Boolean, default: false},
	isBusy : {type: Boolean, default: false},
	currentLocation: {type: String},
	latitude: {type: String},
	longitude: {type: String},
	currentRideId: {type: String}
}, {
	versionKey : false
}
);

//create Drivers model from schema
var Drivers = mongoose.model('Drivers', driverSchema);

/*driverSchema.plugin(autoIncrement.plugin, {
	model: 'Drivers',
	field: 'driId',
	startAt: 1,
	incrementBy: 1
});*/

exports.Drivers = Drivers;