/**
 * New node file
 */
// super simple rpc server example
var amqp = require('amqp'), util = require('util');

var customer = require('./services/customer');
var driver = require('./services/driver');
var admin = require('./services/admin');
var ride = require('./services/ride');
var billing = require('./services/billing');

var cnn = amqp.createConnection({
	host : '127.0.0.1'
});

var mongoose = require('mongoose');
var connection = mongoose.connect("mongodb://localhost:27017/uber");

cnn.on('ready', function() {
	console.log("listening on customer_queue");

	cnn.queue('customer_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log("customer_queue: ");
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			switch (message.func) {
				case "registerCustomer":
					customer.registerCustomer(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;

				case "loginCustomer":
					customer.loginCustomer(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
				case "deleteCustomer":
					customer.deleteCustomer(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
				case "listAllCustomers":
					customer.listAllCustomers(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
			}
		});
	});

	console.log("listening on driver_queue");
	cnn.queue('driver_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log("driver_queue: ");
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			switch (message.func) {
				case "registerDriver":
					driver.registerDriver(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;

				case "loginDriver":
					driver.loginDriver(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
			}
		});
	});

	console.log("listening on admin_queue");
	cnn.queue('admin_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log("admin_queue: ");
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			switch (message.func) {
				case "registerAdmin":
					admin.registerAdmin(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;

				case "loginAdmin":
					admin.loginAdmin(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
			}
		});
	});

	console.log("listening on ride_queue");
	cnn.queue('ride_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log("ride_queue: ");
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			switch (message.func) {
				case "createRide":
					ride.createRide(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
			}
		});
	});

	console.log("listening on bill_queue");
	cnn.queue('bill_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log("bill_queue: ");
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			switch (message.func) {
				case "generateBill":
					billing.generateBill(message, function (err, res) {

						util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, res, {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
						});
					});
					break;
			}
		});
	});
});