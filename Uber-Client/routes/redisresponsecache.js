var redis = require('redis');
var client = redis.createClient(); //creates a new client 

client.on("connect", function () {
    console.log('Redis is Connected!!!!');
});

client.on("error", function (err) {
    console.log("Error in Redis	client " + err);
});

function getClient (){
	  return client;	
}

exports.getClient=getClient;