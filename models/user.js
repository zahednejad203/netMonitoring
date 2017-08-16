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

function user(userData) {
	this.national_number = "";
	this.gender = "";
	this.mobile_number = "";
	this.email = "";
	this.given_name_en = "";
	this.family_name_en = "";
	this.std_number = "";
	this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNThiMzFjYjM0YTQxNGEwMDFjNzU3ZTM5IiwicyI6IjU5OTIwYjVmNjk0NTJiMDAxMmI5Nzc1MyIsImlhdCI6MTUwMjc0MzM5MX0.gQjf8aXhAY3LMWiG7PrLywkAnMLOka77PhyVwZAyVMk";
	this.host = "https://account.aut.ac.ir/api/admin/find/";
	this.notInitialaze = true;
	this.username = userData["User-Name"];
	this.lastusage = userData.userUsage;
	this.usage = 0;
	this.notInitialaze = true;
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
					this.national_number = responseData.identity.national_number;
					this.gender = responseData.identity.gender;
					this.mobile_number = responseData.identity.mobile_number;
					this.email = responseData.identity.email;
					this.given_name_en = responseData.identity.given_name_en;
					this.family_name_en = responseData.identity.family_name_en;
					if (responseData.identity.std_numbers != null && responseData.identity.std_numbers != "undefined") {
						this.std_number = responseData.identity.std_numbers[responseData.identity.std_numbers.length - 1];
					}else{
						this.std_number = 0//responseData.identity.std_numbers[];
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
	console.log(allUsage);
	this.usage = allUsage - this.lastusage;
	this.lastusage = allUsage;
	global.influxDb.write(this);
}

module.exports = user;