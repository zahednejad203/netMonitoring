var influx = require("./Utils/influx.js");
var radius = require("./radius")
var reqClass = require("./Utils/req.js");

global.req = new reqClass();
global.influxDb = new influx();
global.allUsers = {};
global.counter = 0;
// var timersInterval = require("timers");
// var user = {
//   "username" : "niloo",
//   "userUsage" : 1000 ,
// };
// var newUser = new userModel(user) ;

// var usage = 1000 ;
// timersInterval.setInterval(() => {
//   usage = usage + (Math.random()+10)*100;
//   usage = Math.floor(usage)
//   newUser.writeUserData(usage);
// }, 10);