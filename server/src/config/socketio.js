import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://murmur-1.onrender.com"],
    }
});

export function getReceviersSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {}

io.on('connection', (socket) => {
    console.log('a user connected');
    const userId = socket.handshake.query.userId;
    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("onlineUsers", Object.keys(userSocketMap)); 
    

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
})

export { io, server, app };