'use strict';

var MyEmitter = require('../src/MyEmitter');

describe('MyEmitter', function() {
	it('should fire the "updated" event when calling its "update" function', function() {
		var myEmitter = new MyEmitter();
		var updatedEventWasFired = false;
		
		myEmitter.on('updated', function() {
			updatedEventWasFired = true;
		});
		
		myEmitter.update();
		
		expect(updatedEventWasFired).toBe(true);
	});
	
	it('should fire the "end" event when the "update"" function is called 3 times', function() {
		var myEmitter = new MyEmitter();
		var endEventCounter = 0;
		var updateEventCounter = 0;
		
		myEmitter.on('end', function() {
			endEventCounter += 1;
		});
		
		myEmitter.on('updated', function() {
			updateEventCounter += 1;
		});
		
		myEmitter.update();
		myEmitter.update();
		myEmitter.update();
		
		expect(endEventCounter).toBe(1);
		
		myEmitter.update();
		
		expect(endEventCounter).toBe(1);
		expect(updateEventCounter).toBe(3);
		
	});
});