
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
    , index = require('./routes/index')
  , customer = require('./routes/customer')
    , admin = require('./routes/admin')
    , driver = require('./routes/driver')
  , logout = require('./routes/logout')
  , ride = require('./routes/ride')
  , billing = require('./routes/billing')
  , expressSession = require("express-session")
  , mongoStore = require("connect-mongo")(expressSession)
  , mongo = require("./routes/mongo");

//mongoDB session URL
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(expressSession({
		secret : 'mySECRETMongoDBString',
		resave : false, // don't save session if unmodified
		saveUninitialized : false, // don't create session until something stored
		duration : 30 * 60 * 1000,
		activeDuration : 5 * 60 * 1000,
		store : new mongoStore({
			url : mongoSessionConnectURL
		})
	}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/loginCustomer',customer.login);
app.get('/signupCustomer',customer.index);
app.get('/listAllCustomers', customer.listAllCustomers);
app.get('/deleteCustomer', customer.deleteCustomer);
app.get('/logout', logout.logout);

//driver
app.get('/searchDriver', driver.searchDriver);
app.post('/deleteDriver', driver.deleteDriver);
app.get('/getDriverInformation', driver.getDriverInformation);
app.post('/updateDriver', driver.updateDriver);

//register
app.post('/registerCustomer', customer.registerCustomer);
app.post('/registerDriver', driver.registerDriver);
app.post('/registerAdmin', admin.registerAdmin);

//login
app.post('/loginCustomer', customer.loginCustomer);
app.post('/loginDriver', driver.loginDriver);
app.post('/loginAdmin', admin.loginAdmin);

//rides
app.post('/createRide', ride.createRide);
app.get('/rideInfo', ride.getRideInformation);
app.post('/updateRide', ride.updateRide);
app.post('/deleteRide', ride.deleteRide);
app.get('/customerRideList', ride.customerRideList);
app.get('/driverRideList', ride.driverRideList);

//billing
app.post('/generateBill', billing.generateBill);

app.get('/maps',index.maps);

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function() {
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
});