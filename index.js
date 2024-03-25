const express = require('express');
const app = express();
const PORT = 4000;


const http = require('http').Server(app);
const cors = require('cors');
// const { createServer } = require('node:http');
// const { Server } = require('socket.io');

app.use(cors());

// const server = createServer(app);
// const io = new Server(server);

const socketIO = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000'
    }
});



socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected`);

    socket.on('message', (data) => {
        console.log(data);
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// io.on('connection', (socket) => {
//     console.log('user is connected');

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });

//     socket.on('message', (data) => {
//         console.log(data);
//     });
// });

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


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})