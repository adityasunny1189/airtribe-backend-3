const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const PORT = 5000;

const app = express();
const httpServer = http.createServer(app);
const server = socketio(httpServer);

server.on('connection', (socket) => {
    console.log("A user connected");

    socket.on('joinRoom', ({ username, roomId }) => {

    });

    socket.on('sendMessage', () => {

    });

    socket.on('disconnect', () => {

    });
});


server.listen(PORT, (err) => {
    if(err) {
        console.log("Error while running the server ", err);
        return;
    }
    console.log("Server up and running at port: ", PORT);
});
