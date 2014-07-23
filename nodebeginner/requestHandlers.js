//allows node to execute system commands and child processes
var exec = require("child_process").exec;

function start(response) {
	console.log("Request handler 'start' was called.");
	
	//this merely used to show that you can see responses from '/upload' while '/start' is still computing.
	exec("find /",
		{ timeout: 10000, maxBuffer: 20000*1024 },
		 function (error, stdout, stderr) {
	    	 response.writeHead(200, {"Content-Type": "text/plain"});
			 response.write("Hello World");
			 response.end();	
		 }
	 );
}

function upload(response) {
	console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello Upload");
    response.end();
}

exports.start = start;
exports.upload = upload;