/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Uber' });
};

exports.login = function(req,res){
  res.render('login');

};
exports.maps = function (req,res) {
  res.render('demoMaps');
};

exports.chartRender = function(req,res){
  res.render('mapAnalysisChart');
};

exports.customerAnalysisChart = function(req,res){

  console.log("print : "+req.param('customerId'));
  var customerId = req.param('customerId');
  res.render('mapAnalysisCustomer', {customerId: customerId});
};

exports.driverAnalysisChart = function(req,res){

  var driverId = req.param('driverId');
  res.render('mapAnalysisDriver', {driverId: driverId});
};