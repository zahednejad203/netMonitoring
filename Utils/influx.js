const Influx = require('influxdb-nodejs');
const client = new Influx('http://127.0.0.1:8086/NetUsage');
const fieldSchema = {
  usage: 'i'
};
const tagSchema = {
  username: 's' 
};

var method = influx.prototype;

function influx() {
	client.schema('user', fieldSchema, tagSchema, {
		// default is false
		stripUnknown: false,
	});
};

method.write = function (user) {
	console.log(typeof parseInt(user.usage));
	client.write('user')
	  	.tag({
	    	username: user.username, 
	  	})
	  	.field({
	    	usage: user.usage,
	  	})
	  	.then()
	  	.catch(console.error);
};

module.exports = influx;