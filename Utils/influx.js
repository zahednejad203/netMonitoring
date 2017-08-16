const Influx = require('influxdb-nodejs');
const client = new Influx('http://127.0.0.1:8086/NetUsage');

const fieldSchema = {
  usage: 'i'
};

const tagSchema = {
  	username: 's',
  	userId: 's',
  	nationalNumber: 's',
	mobileNumber: 's',
	familyName: 's'
};

var method = influx.prototype;

function influx() {
	client.schema('network', fieldSchema, tagSchema, {
		// default is false
		stripUnknown: false,
	});
};

method.write = function (user) {
	console.log(user.userId + "  " + user.national_number + "  " + user.mobile_number + "  " + user.family_name_en );
	client.write('network')
	  	.tag({
	    	username: user.username,
		  	userId: user.userId,
		  	nationalNumber: user.national_number,
			mobileNumber: user.mobile_number,
			familyName: user.family_name_en
	  	})
	  	.field({
	    	usage: typeof parseInt(user.usage),
	  	})
	  	.then()
	  	.catch(console.error);
};

module.exports = influx;