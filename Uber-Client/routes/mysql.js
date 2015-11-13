//connecting mysql using sequelize

var Sequelize = require('sequelize');

var sequelize = new Sequelize('test', 'root', '123456', { 
	host: 'localhost',
	dialect: 'mysql', 
	port: '3306'
});

exports.sequelize = sequelize;