'use strict'

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(
	'mongodb://127.0.0.1:27017/accounting', 
	function(err, connection) {
		var collection = connection.collection('customers');
		//collection.update({'name': 'Jane Doe'}, {'$set': {'age': 25}}, function(err, count) { //updates only docs with name = Jane Doe
		//collection.update({}, {'$set': {'age': 24}}, function(err, count) { //updates the first match in the entire set of docs.
		collection.update({}, {'$set': {'age': 24}}, {'multi': true}, function(err, count) { //updates the first match in the entire set of docs.
			console.log(count + ' documents updated.');
			collection.find().toArray(function(err, documents) {
				console.dir(documents);
				connection.close();
			});
		});
	});
