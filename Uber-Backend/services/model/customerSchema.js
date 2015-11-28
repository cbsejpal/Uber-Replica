//creating customer model

//mysql
var mysql = require('../mysql');
var Sequelize = require('sequelize');
var sequelize = mysql.sequelize;

var Customer = sequelize.define('Customer', {
	customer_id: {type: Sequelize.INTEGER(9).ZEROFILL, autoIncrement: true, primaryKey: true},
	email: {type: Sequelize.STRING, unique: true},
	password: Sequelize.STRING,
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	address: Sequelize.STRING,
	city: Sequelize.STRING,
	state: Sequelize.STRING,
	zipCode: Sequelize.STRING,
	phoneNumber: Sequelize.STRING,
	creditCard: Sequelize.TEXT,
	verifyStatus: {type: Sequelize.BOOLEAN, defaultValue: false}
},{
	timestamps: false, //by default sequelize will add createdAt and updatedAt columns into tables so to remove them use this attribute
	freezeTableName: true //by default sequelize will create customerS table and not customer so this attribute won't allow it to plural the table name
});

Customer.sync();

exports.Customer = Customer;


//mongodb
var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://localhost:27017/newuber");
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

//create customer and related schema using mongoose

var image = new Schema({
	path: String
}, {
	_id : false
});

var ridesList = new Schema({
	rideId : {
		type: String, 
		required: true
	},
	rating: Number,
	reviews: String,
	images: [image]
}, {
	_id : false
});


var customerSchema = new Schema({
	custId: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	rides: [ridesList],
	verifyStatus: {type: Boolean, default: false}
}, {
	versionKey : false
});

//create Customers model from schema
var Customers = mongoose.model('Customers', customerSchema);

customerSchema.plugin(autoIncrement.plugin, {
	model: 'Customers',
	field: 'custId',
	startAt: 1,
	incrementBy: 1
});

exports.Customers = Customers;