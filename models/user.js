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

method.writeUserData = function (usage) {
	this.usage = usage - this.lastusage;
	this.lastusage = this.usage;
	global.influxDb.write(this);
}

module.exports = user;