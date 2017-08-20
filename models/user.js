var username = "" ;
var usage = 0 ;
var lastusage = 0 ; 
var national_number = "";
var gender = "";
var mobile_number = "";
var email = "";
var given_name_en = "";
var family_name_en = "";
var std_number = "";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNThiMzFjYjM0YTQxNGEwMDFjNzU3ZTM5IiwicyI6IjU5OTIwYjVmNjk0NTJiMDAxMmI5Nzc1MyIsImlhdCI6MTUwMjc0MzM5MX0.gQjf8aXhAY3LMWiG7PrLywkAnMLOka77PhyVwZAyVMk";
var host = "https://account.aut.ac.ir/api/admin/find/";
var notInitialaze = true;
var group = ""

function user(userData) {
	this.national_number = "1111111111";
	this.gender = "female";
	this.mobile_number = "0912111111";
	this.email = "undefined@aut.ac.ir";
	this.given_name_en = "sample";
	this.family_name_en = "sample";
	this.std_number = "1111111";
	this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNThiMzFjYjM0YTQxNGEwMDFjNzU3ZTM5IiwicyI6IjU5OTIwYjVmNjk0NTJiMDAxMmI5Nzc1MyIsImlhdCI6MTUwMjc0MzM5MX0.gQjf8aXhAY3LMWiG7PrLywkAnMLOka77PhyVwZAyVMk";
	this.host = "https://account.aut.ac.ir/api/admin/find/";
	this.notInitialaze = true;
	this.username = userData["User-Name"];
	this.lastusage = userData.userUsage;
	this.usage = 0;
	this.notInitialaze = true;
	this.group = "BS";
}

// class methods
var method = user.prototype;

method.setProperty = function () {
	if (this.notInitialaze) {
		this.notInitialaze = false
		global.req.get(this.host + this.username + "?token=" + this.token , 
			(body) => {
				// console.log((body));
				var responseData = JSON.parse(body);
				if (responseData.identity != null && responseData.identity != "undefined") {
					if (responseData.identity.national_number != null && responseData.identity.national_number != "undefined") {
						this.national_number = responseData.identity.national_number;
					}
					if (responseData.identity.gender != null && responseData.identity.gender != "undefined") {
						this.gender = responseData.identity.gender;
					}
					if (responseData.identity.mobile_number != null && responseData.identity.mobile_number != "undefined") {
						this.mobile_number = responseData.identity.mobile_number;
					}
					if (responseData.identity.email != null && responseData.identity.email != "undefined") {
						this.email = responseData.identity.email;
					}
					if (responseData.identity.given_name_en != null && responseData.identity.given_name_en != "undefined") {
						this.given_name_en = responseData.identity.given_name_en;
					}
					if (responseData.identity.family_name_en != null && responseData.identity.family_name_en != "undefined") {
						this.family_name_en = responseData.identity.family_name_en;
					}
					if (responseData.identity.group != null && responseData.identity.group != "undefined") {
						this.group = responseData.identity.group;
					}
					if (responseData.identity.std_numbers != null && responseData.identity.std_numbers != "undefined") {
						if (responseData.identity.std_numbers[responseData.identity.std_numbers.length - 1] != null && responseData.identity.std_numbers[responseData.identity.std_numbers.length - 1] != "UNKNOWN" && responseData.identity.std_numbers[responseData.identity.std_numbers.length - 1] != "undefined") {
							this.std_number = responseData.identity.std_numbers[responseData.identity.std_numbers.length - 1];						
						}
					}
					global.allUsers[this.username] = this;
				}
			},
			function (error) {
				this.notInitialaze = true
				console.log(error);
			}
		)
	}
}

method.writeUserData = function (allUsage) {
	console.log(this.lastusage + "    " + allUsage);
	var usage = allUsage - this.lastusage;
	global.totalCounter = global.totalCounter + 1;
	if (usage >= 0) {
		this.usage = allUsage - this.lastusage;
		this.usage = Math.floor(this.usage * 0.000001)
		this.lastusage = allUsage;
	}else{
		global.errorCounter = global.errorCounter + 1 ;	
		console.log(global.errorCounter + " error data in : " + global.totalCounter);
	}
	global.influxDb.write(this);
}

module.exports = user;