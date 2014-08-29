var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
	console.log("IN CHECK_IF_COMPLETE: " + completedTasks);
	completedTasks++;	
	if(completedTasks == tasks.length) {
		for (var index in wordCounts) {
			console.log(index +': ' + wordCounts[index]);
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

function count(file) {
	return function() {
		fs.readFile(file, function(err, text) {
			if(err) throw err;
			console.log("IN COUNT: " + completedTasks);
			countWordsInText(text);
			checkIfComplete();
		});
	}
}
	

fs.readdir(filesDir, function(err, files) {
	if(err) throw err;
	for(var index in files) {
		var task = count(filesDir + '/' + files[index]);
		tasks.push(task);
	}
	for(var task in tasks) {
		tasks[task]();
	}
});