
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Uber' });
};

exports.login = function(req,res){
	res.render('login');
	
}
exports.maps = function (req,res) {
  res.render('demoMaps');
}