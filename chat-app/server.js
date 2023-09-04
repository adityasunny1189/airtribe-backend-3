const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const PORT = 3001;

const app = express();
const httpServer = http.createServer(app);
const server = socketio(httpServer);

let users = [];

const addUser = (socketId, username, roomId) => {
    let newUser = {
        socketId: socketId,
        username: username,
        roomId: roomId
    };
    return newUser;
}

const getUser = (socketId) => {
    return users.filter(usr => usr.socketId == socketId);
}

server.on('connection', (socket) => {
    console.log("A user connected");

    socket.on('joinRoom', ({ username, roomId }) => {
        let user = addUser(socket.id, username, roomId);

        users.push(user);
        
        socket
            .join(user.roomId);

        socket
            .emit('message', 'Welcome to airtribe chat');
        
        socket
            .broadcast
            .to(roomId)
            .emit('message', `${username} joined the chat`);
    });

    socket.on('sendMessage', (message) => {
        let user = getUser(socket.id);
        if(user) {
            io.to(user.roomId).emit('message', message);
        }
    });

    socket.on('disconnect', () => {
        let user = getUser(socket.id);
        if(user) {
            io.to(user.roomId).emit('message', `${user.username} has left the room`);
            // remove user from users
        }
    });

});


server.listen(PORT, (err) => {
    if(err) {
        console.log("Error while running the server ", err);
        return;
    }
    console.log("Server up and running at port: ", PORT);
});
