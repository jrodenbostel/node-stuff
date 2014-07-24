var server = require("./server-module");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {
	"/" : requestHandlers.start,
	"/start" : requestHandlers.start,
	"/upload" : requestHandlers.upload,
	"/show" : requestHandlers.show
}

server.start(router.route, handle);