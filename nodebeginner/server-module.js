//these are node modules.
var http = require("http");
var url = require("url");

function start(route, handler) {
  function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname, postData = "";
    console.log("Request for " + pathname + " received.");
	
	request.setEncoding("utf8");	
	
	request.addListener("data", function(data){
		postData += data;
		console.log("Received POST chunk " + data);
	});
	
	request.addListener("end", function() {
		route(handler, pathname, response, postData);	
	});
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;