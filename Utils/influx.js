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
		stripUnknown: true,
	});
};

method.write = function (user) {
	var usage = parseInt(user.usage);
	console.log(user.username + "  " + user.std_number + "  " + user.national_number + "  " + user.mobile_number + "  " + user.family_name_en + "  " + usage);
	client.write('network')
	  	.tag({
	    	username: user.username,
		  	userId: user.std_number,
		  	nationalNumber: user.national_number,
			mobileNumber: user.mobile_number,
			familyName: user.family_name_en
	  	})
	  	.field({
	    	usage: usage,
	  	})
	  	.then(console.log("success"))
	  	.catch(console.error);
};

module.exports = influx;