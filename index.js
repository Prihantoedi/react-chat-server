const express = require('express');
const app = express();
const http = require('http');
const PORT = 4000;

const cors = require('cors');
const { Server } = require('socket.io');
const mysql = require('mysql');
// import { v4 as uuidv4} from 'uuid';
const {v4: uuidv4} = require('uuid');

app.use(cors());




const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'realtime_chat',
});

con.connect(function(err){
    if(err) throw err;
    console.log('Connected to database');
});

const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let allUsers = [];

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        const {username, room} = data;
        socket.join(room); // join the user to a socket room

        let __createdtime__ = Date.now();
        // let createdtime = Date.now();

        // send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit('receive_messages', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT, 
            __createdtime__,
        });

        // send welcome msg to user that just joined chat only
        socket.emit('receive_messages', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // save the new user to the room

        chatRoom = room;
        allUsers.push({id: socket.id, username, room});
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

        socket.on('send_message', (data) => {
            const { username, room, message, __createdtime__} = data;

            console.log(data);
            io.in(room).emit('receive_message', data); // send to all users in room ,including sender
            
            const idMessage = uuidv4();
            const sqlInsert = 'INSERT INTO messages(id, message, username, room, created_at) VALUES(?, ?, ?, ?, ?)';
            con.query(sqlInsert, [idMessage, message, username, room, __createdtime__], (error, results, fields) => {
                if(error) throw error;

                if(results.protocol41 === true){
                    console.log(results);
                } else{
                    console.log(error);
                }
            });

        });

    });
});


app.get('/', (req, res) => {
    const myId = uuidv4();

    console.log(myId);
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