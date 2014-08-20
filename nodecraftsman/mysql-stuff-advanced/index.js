'use strict'

var mysql = require('mysql'),
	http = require('http'),
	url = require('url'),
	querystring = require('querystring');

//create a server, listening on 8888, passing requests to supplied function.	
http.createServer(handleRequest).listen(8888);

function handleRequest(request, response) {
	var pageContent = '<html>' +
	'<head>' +
	'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
	'</head>' +
	'<body>' +
	'<form action="/add" method="POST">' +
	'<input type="text" name="user_name">' +
	'<input type="text" name="password">' +
	'<input type="submit" value="Add content" />' +
	'</form>' +
	'<div>' +
	'<strong>Content in database:</strong>' +
	'<pre>' +
	'DBCONTENT' +
	'</pre>' +
	'</div>' +
	'<form action="/" method="GET">' +
	'<input type="text" name="q">' +
	'<input type="submit" value="Filter content" />' +
	'</form>' +
	'</body>' +
	'</html>';
	
	var pathname = url.parse(request.url).pathname;
	
	if(pathname == '/add') {
		var requestBody = '', postParameters;
		request.on('data', function(data) {
			requestBody += data;
		});
		request.on('end', function() {
			postParameters= querystring.parse(requestBody);
			addContentToDatabase(postParameters.user_name, postParameters.password, function() {
				response.writeHead(302, {'Location': '/'});
				response.end();
			});
		});		
	}
	else if (pathname == "/") {
		var urlString = url.parse(request.url); // gets the url from the request
		var queryString = querystring.parse(urlString.query); // gets the query string from the url
		var filter = queryString.q; //gets the param 'q' from the query string
//		console.log(filter);
		getContentsFromDatabase(filter, function(content) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			//cheapest. templating system. ever.
			response.write(pageContent.replace('DBCONTENT', content));
			response.end();
		});
	}
}

function getContentsFromDatabase(filter, callback) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'node-test'
	}),
	query, 
	resultString = "";
	
	if(filter) {
		query = connection.query('select id, user_name, password from users where user_name LIKE "' + filter + '%"');
	}
	else {
		query = connection.query('select id, user_name, password from users');
	}
	
	query.on('error', function(error) {
		console.log(error);
	});
	query.on('result', function(result) {
		resultString += result.id;
		resultString += ", user_name: " + result.user_name;
		resultString += ", password: " + result.password;
		resultString += "\n";
	});
	
	query.on('end', function(result) {
		connection.end();
		callback(resultString);
	});
}

function addContentToDatabase(user_name, password, callback) {
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'node-test'
	});
	
	connection.query('INSERT INTO users (user_name, password) VALUES ("' + user_name + '", "' + password + '")', 
		function(error) {
			console.log(error);
			callback(); //
		}
	);
}