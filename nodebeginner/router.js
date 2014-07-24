function route(handler, pathname, response, request) {
	console.log("About to route to route request for " + pathname);
	if(typeof(handler[pathname]) == 'function') {
		handler[pathname](response, request);
	}
	else {
		console.log("No route found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;