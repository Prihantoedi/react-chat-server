const express = require('express');
const app = express();
const http = require('http');
const PORT = 4000;



// const http = require('http').Server(app);
const cors = require('cors');
// const { createServer } = require('node:http');
const { Server } = require('socket.io');

app.use(cors());

// const server = createServer(app);
// const io = new Server(server);

// const socketIO = require('socket.io')(http, {
//     cors: {
//         origin: 'http://localhost:3000'
//     }
// });



// socketIO.on('connection', (socket) => {
//     console.log(`${socket.id} user just connected`);

//     socket.on('message', (data) => {
//         console.log(data);
//     })

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
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