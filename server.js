 var udp = require('dgram');
 var readline = require('readline');
 var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var ip = ""

// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 2055 })
var ws = null;

wss.on('connection', socket => {
  ws = socket;
})

// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message',function(msg,info){
  console.log('Data received from client : ' + msg.toString());

  if(ws !== null){ 
    var msg1 = msg.toString().split(",")
    var data = {
      "x": msg1[0],
      "y": msg1[1],
      "z": msg1[2]
    }
    ws.send(JSON.stringify(data));
  }

  //sending msg
  server.send(msg,info.port,ip,function(error){
    if(error){
      console.log(error);
      client.close();
    }else{
      // console.log('Data sent');
    }
  });
});

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server IP :' + ipaddr);
  console.log('Server is listening at port ' + port);
  
  rl.question('Enter the client IP address: ', (res) => {
    // TODO: Log the answer in a database
    ip = res
    // console.log(`Client IP : ${ip}`);
    rl.close();
  });
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed !');
});

server.bind(2055);