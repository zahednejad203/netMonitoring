var username = "" ;
var usage = 0 ;
var lastusage = 0 ; 

function user(userData) {
	this.username = userData.username;
	this.lastusage = userData.userUsage;
	this.usage = 0;
}

// class methods
var method = user.prototype;

method.writeUserData = function (allUsage) {
	this.usage = allUsage - this.lastusage;
	this.lastusage = allUsage;
	global.influxDb.write(this);
}

module.exports = user;