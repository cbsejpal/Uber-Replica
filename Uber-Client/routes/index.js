
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Uber' });
};

exports.maps = function (req,res) {
  res.render('demoMaps');
}