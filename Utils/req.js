// Constructor
var request = require('request');
var timersInterval = require("timers");
var queue = {};
var pointerS = 0;
var pointerE = 0;
var length = 100;
var timeInterval = 100;
var canSendReq = true;

function req() {
	this.queue = {};
	this.pointerS = 0;
	this.pointerE = 0;
	this.length = 100;
	this.timeInterval = 100;
	this.canSendReq = true;
  	timersInterval.setInterval(() => {
  		// console.log("start " + this.pointerS + "   end  " + this.pointerE);
		if (this.checkQueue() && this.canSendReq) {
  			// console.log("start ttt");
			this.sendReq();
		}
	}, this.timeInterval);
}

// class methods
var method = req.prototype 

method.get = function(url , success , faild) { 
	// console.log(url)
	var newReq = {}
	newReq["url"] = url;
	newReq["success"] = success;
	newReq["faild"] = faild;
	this.queue[this.pointerE] = newReq;
	this.pointerE = this.pointerE + 1;
	
};

method.checkQueue = function () {
	if (this.pointerS == this.pointerE) {
		return false;
	}
	return true;
}

method.sendReq = function () {
	// console.log("start");
	if (this.canSendReq) {
		this.canSendReq = false
		if (this.queue[this.pointerS].url && this.queue[this.pointerS].url != "undefined") {
			request(
				{
				    url: this.queue[this.pointerS].url , //URL to hit
				    method: 'GET',
				    //Lets post the following key/values as form
				    
				},
				(error , response, body) => {
					this.canSendReq = true;
				    if(error) {
				    	this.queue[this.pointerS].faild(error);
				    } else {
						this.queue[this.pointerS].success(body);
					}
					this.pointerS = this.pointerS + 1;
				}
			); 
		}
	}
}

method.post = function(success , faild) { 
	// console.log("request to : " + 'http://iot.ceit.aut.ac.ir:58902/discovery')
	// var onCompelete = 0 ;
	// for (var i = 0; i < typs.length; i++) {
	// 	var url = 'http://iot.ceit.aut.ac.ir:58902/model/'+typs[i];
	// 	console.log("36 : " + url);
	// 	request(
	// 		{
	// 		    url: url, //URL to hit
	// 		    method: 'GET',
	// 		    //Lets post the following key/values as form
			    
	// 		},
	// 		function(error , response, body){
	// 		    if(error) {
	// 		    	onCompelete = onCompelete + 1 ;
	// 		    	if (onCompelete == typs.length) {
	// 					faild(error);	
	// 		    	}
	// 		    } else {
	// 		    	console.log("49 : " + body)
	// 		    	onCompelete = onCompelete + 1 ;
	// 		    	var responseData = JSON.parse(body);
	// 		    	var newModel = {};
	// 		    	newModel.master = responseData.master
	// 		    	if (responseData.master == "sensor") {
	// 		    		newModel.state = [];
	// 		    		for (var i = 0; i < responseData.states.length; i++) {
	// 		    			newModel.state[newModel.state.length] = responseData.states[i];
	// 		    		}
	// 		    		for (var i = 0; i < responseData.events.length; i++) {
	// 		    			newModel.state[newModel.state.length] = responseData.events[i];
	// 		    		}
	// 		    	}else if (responseData.master == "actuator"){
	// 		    		newModel.settings = [];
	// 		    		for (var i = 0; i < responseData.settings.length; i++) {
	// 		    			var settingElement = responseData.settings[i];
	// 		    			var newSettings = {};
	// 		    			newSettings["item"] = settingElement.name;
	// 		    			if (settingElement.type == "bool") {
	// 		    				newSettings["values"] = [true , false];
	// 		    			}else if (settingElement.type == "integer"){
	// 		    				newSettings["values"] = [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	// 		    			}else if (settingElement.type == "string"){
	// 		    				if (newSettings.item == "color") {
	// 		    					newSettings["values"] = ["#ff0000" , "#0000ff" , "#00FF00" ];	
	// 		    				}else{
	// 		    					newSettings["values"] = [""];	
	// 		    				}
	// 		    			}
	// 		    			newModel.settings[newModel.settings.length] = newSettings;
	// 		    		}
	// 		    	}
	// 		    	global.thingModels[responseData.type] = newModel;
	// 		    	if (onCompelete == typs.length) {
	// 		    		console.log("84 : " + JSON.stringify(global.thingModels));
	// 					success();	
	// 		    	}
	// 			}
	// 		}
	// 	); 
	// }
};


module.exports = req;