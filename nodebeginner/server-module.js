//these are node modules.
var formidable = require("formidable"), 
	http = require("http"), 
	url = require("url");

function start(route, handler) {
  function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname, postData = "";
    console.log("Request for " + pathname + " received.");	
	route(handler, pathname, response, request);	
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;