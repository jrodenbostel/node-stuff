'use strict'

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	database: 'tenneco',
	user: 'root'
});

/*This is normal operation*/
 connection.query('SELECT user_name, password from users', function(error, results, fields) {
 	console.log(results); //logs the whole result as an array
 	console.log(results[0].user_name)
// 	connection.end();
});

/*Using the query's event emitter to process results as they're returned*/

var query = connection.query('SELECT user_name, password from users');
query.on('error', function(error) {
	console.log(error);
})

query.on('fields', function(fields) {
	console.log(fields);
});

query.on('result', function(row) {
	console.log(row.user_name);
});

query.on('end', function(row) {
	console.log('Query is complete.');
	connection.end();
});