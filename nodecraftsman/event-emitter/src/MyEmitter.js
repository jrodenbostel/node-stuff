'use strict';

var MyEmitter = function() {
	this.callbacks = {};
	this.updateCount = 0;
}

MyEmitter.prototype.on = function(eventType, callback) {
	this.callbacks[eventType] = callback;
}

MyEmitter.prototype.update = function() {
	if(this.updateCount < 3) {
		if(this.callbacks['updated']) {
			this.callbacks['updated']();
		}		
	}
	this.updateCount += 1;
	
	if(this.updateCount == 3 && this.callbacks['end']) {
		this.callbacks['end']();
	}
}

module.exports = MyEmitter;