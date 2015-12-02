//connecting mysql using sequelize

var Sequelize = require('sequelize');

var sequelize = new Sequelize('test', 'root', 'Chirag123!@', {
	host: 'localhost',
	dialect: 'mysql', 
	port: '3308'
});

exports.sequelize = sequelize;