var fs = require('fs');
var http = require('http');
var htmlparser = require('htmlparser');
var configFileName = './rss_feeds.txt';

function checkForRssFile() {
	fs.open(configFileName, 'r', function(err, fd) {
		if(err) {
			return next(new Error('The file does not exist.'));
		}
		next(null, configFileName);
	});
}

function readRssFile(configFileName) {
	fs.readFile(configFileName, function(err, lines) {
		if(err) {
			return next(err);
		}
		
		var feedList = lines.toString().replace(/^\s+|\s+$/g, '').split("\n"), 
			random = Math.floor(Math.random()*feedList.length);
			
		next(null, feedList[random]);
	});
}

function downloadRssFeed(feedUrl) {
	http.get(feedUrl, function(response) {
		var responseData = '';
		response.on('data', function(data) {
			responseData += data;
		});
		response.on('end', function() {
			next(null, responseData);
		});
	}).on('error', function(e) {
		return next(e);
	});
}

function parseRssFeed(feedData) {
	var handler = new htmlparser.RssHandler(),
		parser = new htmlparser.Parser(handler);
		
	parser.parseComplete(feedData);
	
	var item = handler.dom.items.shift();
	console.log(item.title);
	console.log(item.link);	
}

var tasks = [checkForRssFile, readRssFile, downloadRssFeed, parseRssFeed];

function next(err, result) {
	if (err) 
		throw err;
	
	var task = tasks.shift();
	
	if(task) {
		task(result);
	}
}

next();