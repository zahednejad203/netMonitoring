var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var senario = require('./../models/senario.js');
var jsonfile = require('jsonfile');
var file = './samples/sampleJson.json';
var files = './samples/sampleJson2.json';
var file1 = './samples/motion1.json';
var file2 = './samples/motion2.json';
var file3 = './samples/motion3.json';
var senarioDiscovery = './samples/senarioDiscoverySample.json';

var states = {};
app.use( bodyParser.json() );
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// app.use(express.json()); 
// respond with "hello world" when a GET request is made to the homepage
app.get('/discovery', function(req, res) {
	// var params = JSON.parse(req.params);
	// console.log(req);
	// global.middleWare.discovery(req , res);
});

app.post('/command', function(req, res) {
	console.log(req.url);
	console.log(req.body);
	global.middleWare.command(req.body , res);
	// res.send(global.middleWare.login());
});

app.post('/setConfig', function(req, res) {
	console.log(req.url);
	console.log(req.body);
	if (req.body != null) {
		global.timeToOff = req.body.time;
		global.light = req.body.light;
		console.log("time is :" + global.timeToOff );
		console.log("light is :" + global.light );
		res.send("success");		
	}else{
		res.send("error");
	}
});

app.post('/getdata', function(req, res) {
	console.log(req.url);
	console.log(req.body);
	global.middleWare.getdata(req , res);
	// res.send(global.middleWare.login());
});

// test apis
app.post('/senario/new', function(req,res) {
	console.log(req.body);
	var newSenario = new senario(req.body);
	res.send("done");
});

app.get('/senario/new', function(req,res) {
	console.log(req.body);
	var newSenario = new senario(jsonfile.readFileSync(file));
	res.send("done");
});
// app.post('/senario/discovery', function(req,res) {
// 	console.log("niloo5");
// 	res.send(jsonfile.readFileSync(senarioDiscovery));
// });

app.post('/senario/discovery', function(req,res) {
	console.log("niloo6");
	global.middleWare.getModels(
		function () {
			global.middleWare.discovery(
				function (respons) {
					console.log("/senario/discovery : " +  respons);
					var responsData = JSON.parse(respons);
					var finalResult = {}
					for (var rpi_id in responsData) {
				        var rpi = responsData[rpi_id] ; 
				        if (rpi.things != null && typeof rpi.things != "undefind") {
					        finalResult[rpi_id] = [];
					        for (var i = 0; i < rpi.things.length; i++) {
					        	var thingElement = rpi.things[i];
					        	var newThing = {};
					        	newThing["device_id"] = thingElement.id;
					        	newThing["type"] = thingElement.type;
					        	console.log(JSON.stringify(global.thingModels[newThing.type]));
					        	if (global.thingModels[newThing.type] != null && typeof global.thingModels[newThing.type] != "undefind") {
						        	if (global.thingModels[newThing.type].master == "sensor") {
						        		newThing["state"] = global.thingModels[newThing.type].state;
						        		newThing["action_type"] = "filter";
						        	}else if(global.thingModels[newThing.type].master == "actuator"){
						        		newThing["settings"] = global.thingModels[newThing.type].settings;
						        		newThing["action_type"] = "notif";
						        	}
						        	finalResult[rpi_id][finalResult[rpi_id].length] = newThing;
						        }
					        }
				        }
				    }
				    var alerts = {}
				    var allUsers = [];
					global.database.findDocuments("users" , null , function (data) {
					    alerts.users = data;
					    alerts.types = ["sms","telegram","mail"];
					    finalResult.alerts = alerts;
					    res.send(finalResult);
					});
				},function (error) {
					res.send(error)
				}
			);
		},function (error) {
			res.send(error);
		}
	);

});

app.get('/senario/discovery', function(req,res) {
	console.log("niloo6");
	global.middleWare.getModels(
		function () {
			global.middleWare.discovery(
				function (respons) {
					console.log("/senario/discovery : " +  respons);
					var responsData = JSON.parse(respons);
					var finalResult = {}
					for (var rpi_id in responsData) {
				        var rpi = responsData[rpi_id] ; 
				        if (rpi.things != null && typeof rpi.things != "undefind") {
					        finalResult[rpi_id] = [];
					        for (var i = 0; i < rpi.things.length; i++) {
					        	var thingElement = rpi.things[i];
					        	var newThing = {};
					        	newThing["device_id"] = thingElement.id;
					        	newThing["type"] = thingElement.type;
					        	console.log(JSON.stringify(global.thingModels[newThing.type]));
					        	if (global.thingModels[newThing.type] != null && typeof global.thingModels[newThing.type] != "undefind") {
						        	if (global.thingModels[newThing.type].master == "sensor") {
						        		newThing["state"] = global.thingModels[newThing.type].state;
						        	}else if(global.thingModels[newThing.type].master == "actuator"){
						        		newThing["settings"] = global.thingModels[newThing.type].settings;
						        	}
						        	finalResult[rpi_id][finalResult[rpi_id].length] = newThing;
						        }
					        }
				        }
				    }
				    var alerts = {}
				    var allUsers = [];
					global.database.findDocuments("users" , null , function (data) {
					    alerts.users = data;
					    alerts.type = ["sms","telegram","mail"];
					    finalResult.alerts = alerts;
					    res.send(finalResult);
					});
				},function (error) {
					res.send(error)
				}
			);
		},function (error) {
			res.send(error);
		}
	);

});

app.get('/commandEmmit1', function(req,res) {
	console.log("niloo1");
	emitter.emit("senario",jsonfile.readFileSync(file1))
	res.send("done");
});

app.get('/commandEmmit2', function(req,res) {
	console.log("niloo2");
	emitter.emit("senario",jsonfile.readFileSync(file2))
	res.send("done");
});

app.get('/commandEmmit3', function(req,res) {
	console.log("niloo3");
	emitter.emit("senario",jsonfile.readFileSync(file3))
	res.send("done");
});

app.get('/offAll', function(req, res) {
	var json = {"type":"lamp",
					"agent_id":"6a38b686-10e0-534a-bfeb-78b40d1254d7",
					"device_id":["3:3"],
					"settings":{
						"on":false
				}
			}
	global.middleWare.command(json , res);
	// res.send(global.middleWare.login());
});

app.get('/onAll', function(req, res) {
	var json = {"type":"lamp",
					"agent_id":"6a38b686-10e0-534a-bfeb-78b40d1254d7",
					"device_id":["3:3"],
					"settings":{
						"on":true
				}
			}
	global.middleWare.command(json , res);
	// res.send(global.middleWare.login());
});

app.get('/sendMessage', function(req, res) {
	// var json = {
	// 	"Username" : 9173145877,
	// 	"PassWord" : 61618577,
	// 	"SenderNumber": 50002060111111,
	// 	"RecipientNumbers":[09124982310],
	// 	"MessageBodie":"یا قمر بنی هاشم",
	// 	"Type":1,
	// 	"AllowedDelay":0
	// };
	var json = "http://www.payam-resan.com/APISend.aspx?Username=09173145877&Password=61618577&From=50002060111111&To=09124982310&Text='یا قمر بنی هاشم'";
	global.middleWare.sendMessage(json , res);
	// res.send(global.middleWare.login());
});

var server = app.listen(9990, function () {
   var host = server.address().address
   var port = server.address().port
})
