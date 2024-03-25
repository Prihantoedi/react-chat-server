const express = require('express');
const app = express();
const http = require('http');
const PORT = 4000;

const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());




const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let allUsers = [];

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        const {username, room} = data;
        socket.join(room); // join the user to a socket room

        let __createdtime___ = Date.now();

        // send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit('receive_messages', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT, 
            __createdtime___,
        });

        // send welcome msg to user that just joined chat only
        socket.emit('receive_messages', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime___,
        });

        // save the new user to the room

        chatRoom = room;
        allUsers.push({id: socket.id, username, room});
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    });
});


app.get('/', (req, res) => {
    res.json({
        message: 'Success',
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello World',
    });
});


server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})