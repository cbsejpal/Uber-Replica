//creating admin model

var mysql = require('../mysql');

var Sequelize = require('sequelize');

var sequelize = mysql.sequelize;

var Admin = sequelize.define('Admin', {
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	address: Sequelize.STRING,
	city: Sequelize.STRING,
	state: Sequelize.STRING,
	zipCode: Sequelize.STRING,
	phoneNumber: Sequelize.BIGINT
},{
	timestamps: false, //by default sequelize will add createdAt and updatedAt columns into tables so to remove them use this attribute
	freezeTableName: true //by default sequelize will create customerS table and not customer so this attribute won't allow it to plural the table name
});

Admin.sync();

exports.Admin = Admin;