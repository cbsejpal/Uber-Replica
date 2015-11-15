/**
 * New node file
 */
var _ = require('underscore')
exports.success = 200;
exports.failure = 401;

exports.responseGenerator = function (status_code,data){
	
	var json_response={
			status: status_code,
			data : data
	};
	
	return json_response;
}

exports.responseGenerator = function (status_code,data1,data2){
	
	var data = _.extend(data1, data2);
	
	var json_response={
			status: status_code,
			data : data
	};
	
	return json_response;
}

