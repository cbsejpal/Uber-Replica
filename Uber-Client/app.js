/**
 * Module dependencies.
 */

var express = require('express')
    , app = express()
    , http = require('http')
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
    , ios = require('socket.io-express-session')
    , mongoStore = require("connect-mongo")(expressSession)
    , mongo = require("./routes/mongo");


//mongoDB session URL
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";

var session = expressSession({
    secret: 'mySECRETMongoDBString',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: mongoSessionConnectURL
    })});

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(session);
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});


app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/loginCustomer', customer.login);
app.get('/signupCustomer', customer.index);
app.get('/loginDriver', driver.login);
app.get('/signupDriver', driver.index);


app.get('/listAllCustomers', customer.listAllCustomers);

app.post('/addImagesToRide', customer.addImagesToRide);
app.get('/getImagesOfRide:image', customer.getImagesOfRide);
app.get('/showCustomers', admin.showCustomers);
app.get('/showDrivers', admin.showDrivers);
app.get('/logout', logout.logout);

//customer


app.get('/deleteCustomer', customer.deleteCustomer);
app.get('/getCustomerInformation', customer.getCustomerInformation);
app.post('/updateCustomer', customer.updateCustomer);

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

//dashboards

app.get('/customerDashboard', customer.customerDashboard);

app.get('/driverDashboard', driver.driverDashboard);

app.get('/adminDashboard', admin.adminDashboard);


//rides
app.post('/createRide', ride.createRide);
app.get('/rideInfo', ride.getRideInformation);
app.post('/updateRide', ride.updateRide);
app.post('/deleteRide', ride.deleteRide);
app.get('/customerRideList', ride.customerRideList);
app.get('/driverRideList', ride.driverRideList);

//admin
app.post('/verifyDrivers', admin.verifyDrivers);
app.post('/verifyCustomers', admin.verifyCustomers);
app.get('/dailyRevenue', admin.revenuePerDayWeekly);
//billing
app.post('/generateBill', billing.generateBill);
app.post('/deleteBill', billing.deleteBill);
app.post('/searchBills', billing.searchBills);

app.get('/maps', index.maps);

var socket;
//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function () {
    console.log('Connected to mongo at: ' + mongoSessionConnectURL);
    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });



    /*io.use(ios(session));

    io.on('connection', function (socket) {

    });*/
});




