//connecting mysql using sequelize

var Sequelize = require('sequelize');

var sequelize = new Sequelize('uber', 'root', '', {
	host: 'localhost',
	dialect: 'mysql', 
	port: '3306'
});

exports.sequelize = sequelize;