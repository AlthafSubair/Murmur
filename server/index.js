import dotenv from 'dotenv';
import authRoute from './src/routes/authRoute.js'
import connectDB from './src/config/connectDB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import messageRoute from './src/routes/messageRouter.js';
import { app, server } from './src/config/socketio.js';
import groupMsgRoute from './src/routes/groupMsgRoute.js';
import fetch from 'node-fetch';




dotenv.config();




app.use(cookieParser());

app.use(cors({
    origin: "https://murmur-1.onrender.com",
    credentials: true
}));


// Replace with your actual deployed backend URL
const SELF_PING_URL = 'https://murmur-1eyn.onrender.com/health';

setInterval(() => {
  fetch(SELF_PING_URL)
    .then(res => console.log(`[Self-Ping] ${res.status} - ${new Date().toLocaleTimeString()}`))
    .catch(err => console.error('Self-ping failed:', err));
}, 1000 * 60 * 5); // every 5 minutes



app.use('/api/auth', authRoute)
app.use('/api/message', messageRoute)
app.use('/api/group', groupMsgRoute)

app.get('/health', (req, res) => res.send('OK'));



const PORT = process.env.PORT || 3000;

connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})