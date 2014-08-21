var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {}; //maps socket ids to names
var namesUsed = []; //keeps a current list of names
var currentRoom = {}; //holds a map where the key is the socket id and the value is the current room.

function listen(server) {
	io = socketio.listen(server);
	io.set('log level', 1);
	io.sockets.on('connection', fuction(socket) {
		
		//these happen for everyone when they connect
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
		joinRoom(socket, 'Lobby');
		
		//these set up event-driven handlers for things that will happen in the future.
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);
		
		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		
		handleClientDisconnection(socket, nickNames, namesUsed);
	});
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', { success: true, name: name });
	namesUsed.push(name);
	return guestNumber + 1;
}

function joinRoom(socket, room) {
	socket.join(room); //becomes a listener to the current channel (room in this case is lobby, socket is the user's connection)
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room}); //hits the user's socket with a 'joinResult' event containing the room info
	socket.broadcast.to(room).emit('message', { //send the message event to everyone on the 'Lobby' channel
		text: nickNames[socket.id] + ' has joined ' + room + '.';
	});
	
	var usersInRoom = io.sockets.clients(room); //returns the list of socket ids in the current channel
	if(usersInRoom.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id;
			if (userSocketId != socket.id) { //filters out the current user's socket, displays everyone elses.
				if(index > 0) {
					usersInRoomSummary += ', ';
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', {text: usersInRoomSummary}); //sends a message back to the client socket.
	}
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) { //listen for nameAttempt event on current socket
		if(name.indexOf('Guest') == 0) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		} else {
			if(namesUsed.indexOf(name) == -1) { //name is not found in the current set of names
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName); //find the old name in the set of names
				namesUsed.push(name); //add the new name
				nickNames[socket.id] = name; //assign the new name
				delete namesUsed[previousNameIndex]; // remove the old name
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', { //from the current connection, broadcasts to the room the current connection is in.
					text: previousName + ' is now known as ' + name + '.';
				});
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	});
}

/**
* relays message from passed-in socket to everyone in the room the current socket is a member of.
**/
function handleMessageBroadcasting(socket) {
	socket.on('message', function(message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text
		});
	});
}

function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom); //new room must be a parameter on the join event that is required
	});
}

function handleClientDisconnection(socket) {
	socket.on('disconnect', function() {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}

exports.listen = listen;