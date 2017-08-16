var userModel = require("./models/user.js");
var radius = require('radius');
var dgram = require("dgram");
var secret = 'kazemi@456';
var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  var code, username, password, packet;
  packet = radius.decode({packet: msg, secret: secret});

  // if (packet.code != 'Access-Request') {
  //   console.log('unknown packet type: ', packet.code);
  //   return;
  // }
  var att = packet.attributes;
  username = att['User-Name'];
  var newUser = global.allUsers[username];
  var allUsage = 0;
  if (att['Acct-Status-Type'] == "Interim-Update" || att['Acct-Status-Type'] =="Stop") {
    allUsage = parseInt(att['Acct-Input-Octets'], 10) + parseInt(att['Acct-Output-Octets'], 10) ;
  }
  att["userUsage"] = allUsage;
  if (newUser == null || newUser == "undefined") {
    newUser = new userModel(att);  
    newUser.setProperty();
  }

  // console.log('Access-Request for ' + username + "   and data usage is : " + allUsage);
  if (global.allUsers[username] != null && global.allUsers[username] != "undefined" ) {
    global.allUsers[username].writeUserData(allUsage);
  }
  // if (username == 'jlpicard' && password == 'beverly123') {
    code = 'Access-Accept';
  // } else {
  //   code = 'Access-Reject';
  // }

  var response = radius.encode_response({
    packet: packet,
    code: code,
    secret: secret
  });

  // console.log('Sending ' + code + ' for user ' + username);
  server.send(response, 0, response.length, rinfo.port, rinfo.address, function(err, bytes) {
    if (err) {
      // console.log('Error sending response to ', rinfo);
    }
  });
});

server.on("listening", function () {
  var address = server.address();
  console.log("radius server listening " +
      address.address + ":" + address.port);
});

server.bind(1813);