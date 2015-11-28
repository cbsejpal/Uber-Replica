
/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , app = express()
    , server = http.Server(app)
    , routes = require('./routes')
    , io = require('./routes/socket').listen(server)
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
app.get('/login',routes.login);
app.get('/loginCustomer',customer.login);
app.get('/signupCustomer',customer.index);
app.get('/loginDriver',driver.login);
app.get('/driverLogin', driver.driverLogin);
app.get('/signupDriver',driver.index);
app.get('/loginAdmin', admin.login);
app.get('/registerAdmin', admin.register);

app.get('/listAllCustomers', customer.listAllCustomers);

app.post('/addImagesToRide',customer.addImagesToRide);
app.get('/getImagesOfRide:image', customer.getImagesOfRide);
app.get('/showCustomers', admin.showCustomers);
app.get('/showDrivers', admin.showDrivers);
app.get('/logout', logout.logout);

//customer

app.get('/deleteCustomer', customer.deleteCustomer);
app.get('/getCustomerInformation', customer.getCustomerInformation);
app.post('/updateCustomer',customer.updateCustomer);


//driver
app.get('/searchDriver', driver.searchDriver);
app.get('/deleteDriver', driver.deleteDriver);
app.get('/getDriverInformation', driver.getDriverInformation);
app.post('/updateDriver', driver.updateDriver);

app.get('/driverDetails', driver.driverDetails);

//register
app.post('/registerCustomer', customer.registerCustomer);
app.post('/registerDriver', driver.registerDriver);
app.post('/registerAdmin', admin.registerAdmin);

//login
app.post('/loginCustomer', customer.loginCustomer);
app.post('/loginDriver', driver.loginDriver);
app.post('/loginAdmin', admin.loginAdmin);

//dashboards

app.get('/customerDashboard',customer.customerDashboard);

app.get('/driverDashboard',driver.driverDashboard);

app.get('/adminDashboard',admin.adminDashboard);


//rides
app.post('/createRide', ride.createRide);
app.get('/rideInfo', ride.getRideInformation);
app.post('/deleteRide', ride.deleteRide);
app.get('/customerRideList', ride.customerRideList);
app.get('/driverRideList', ride.driverRideList);

app.post('/startRide', ride.startRide);
app.post('/endRide', ride.endRide);

//admin
app.get('/verifyDrivers',admin.verifyDrivers);
app.get('/verifyCustomers',admin.verifyCustomers);
app.get('/dailyRevenue', admin.revenuePerDayWeekly);

app.get('/showCustomersForApproval',admin.showCustomersForApproval);

app.get('/showDriversForApproval',admin.showDriversForApproval);
//billing
app.post('/generateBill', billing.generateBill);
app.post('/deleteBill', billing.deleteBill);
app.post('/searchBills', billing.searchBills);

app.get('/requestRide',index.maps);

app.post('/updateDriverDetails', driver.updateDriverDetails);

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function() {
    console.log('Connected to mongo at: ' + mongoSessionConnectURL);
    http.createServer(app).listen(app.get('port'), function() {
        server.listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    });
});