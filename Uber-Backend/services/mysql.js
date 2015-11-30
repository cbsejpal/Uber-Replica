//connecting mysql using sequelize

var Sequelize = require('sequelize');

var sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql', 
	port: '3333'
});

exports.sequelize = sequelize;