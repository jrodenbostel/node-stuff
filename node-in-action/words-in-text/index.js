var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
	console.log("IN CHECK_IF_COMPLETE: " + completedTasks);
	completedTasks++;	
	if(completedTasks == tasks.length) {
		var keys = [];
		for (var index in wordCounts) {
			keys.push(index);
		}
		keys.sort();
		for (var i = 0; i < keys.length; i++) {
			console.log(keys[i] +': ' + wordCounts[keys[i]]);
		}
	}
}

function countWordsInText(text) {
	console.log("IN COUNT_WORDS: " + completedTasks);
	var words = text.toString().toLowerCase().split(/\W+/).sort();
	for(var index in words) {
		var word = words[index];
		if(word) {
			wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
		}
	}
}	

fs.readdir(filesDir, function(err, files) {
	if(err) throw err;
	for(var index in files) {
		var task = function(file) {
			return function() {
				fs.readFile(file, function(err, text) {
					if(err) throw err;
					console.log("IN COUNT: " + completedTasks);
					countWordsInText(text);
					checkIfComplete();
				});
			}
		}(filesDir + '/' + files[index]);
		tasks.push(task);
	}
	for(var task in tasks) {
		tasks[task]();
	}
});