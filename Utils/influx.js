const Influx = require('influxdb-nodejs');
const client = new Influx('http://127.0.0.1:8086/NetUsage');

const fieldSchema = {
  usage: 'i'
};

const tagSchema = {
  	username: 's',
  	userId : 's',
  	national_number : 's',
	mobile_number : 's',
	family_name_en  : 's'
};

var method = influx.prototype;

function influx() {
	client.schema('network', fieldSchema, tagSchema, {
		// default is false
		stripUnknown: false,
	});
};

method.write = function (user) {
	// console.log(typeof parseInt(user.usage));
	client.write('network')
	  	.tag({
	    	username: user.username,
		  	userId : user.userId,
		  	national_number : user.national_number,
			mobile_number : user.mobile_number,
			family_name_en  : user.family_name_en
	  	})
	  	.field({
	    	usage: typeof parseInt(user.usage),
	  	})
	  	.then()
	  	.catch(console.error);
};

module.exports = influx;