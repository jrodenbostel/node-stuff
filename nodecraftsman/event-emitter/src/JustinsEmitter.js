'use strict';

//singleton
var JustinsSingletonEmitter = {
	callbacks: {},
	updateCount: 0,
	
	on: function(eventType, callback) {
		this.callbacks[eventType] = callback;
	},
	
	update: function() {
		if(this.updateCount < 3) {
			console.log('firing updated.');
			if(this.callbacks['updated']) {
				this.callbacks['updated']();
			}		
		}
		console.log('increment');
		this.updateCount += 1;
	
		if(this.updateCount == 3 && this.callbacks['end']) {
			this.callbacks['end']();
		}
	}
}

/*still creates a new object instance each time it's executed, 
but each instance has it's own memory allocated for each function - 
1000 instances would have 1000 memory locations for each function even
though they do the exact same thing
Add them to the prototype, and the functions exist in one place, emulating
how a class contains a single implementation of a method, but instances
invoke those methods themselves in Java.*/
var JustinsEmitter = function() {
	
	return {
		callbacks: {},
		updateCount: 0,
	
		on: function(eventType, callback) {
			this.callbacks[eventType] = callback;
		},
	
		update: function() {
			if(this.updateCount < 3) {
				console.log('firing updated.');
				if(this.callbacks['updated']) {
					this.callbacks['updated']();
				}		
			}
			console.log('increment');
			this.updateCount += 1;
			
			if(this.updateCount == 3 && this.callbacks['end']) {
				this.callbacks['end']();
			}
		}
	}
}
module.exports = JustinsEmitter