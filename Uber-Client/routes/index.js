
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

  var customerId = req.param('customerId');
  res.render('mapAnalysisChart', {customerId: customerId});
};

exports.driverAnalysisChart = function(req,res){

  var driverId = req.param('driverId');
  res.render('mapAnalysisChart', {driverId: driverId});
};