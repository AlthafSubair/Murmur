import dotenv from 'dotenv';
import authRoute from './src/routes/authRoute.js'
import connectDB from './src/config/connectDB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import messageRoute from './src/routes/messageRouter.js';
import { app, server } from './src/config/socketio.js';



dotenv.config();




app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));




app.use('/api/auth', authRoute)
app.use('/api/message', messageRoute)


const PORT = process.env.PORT || 3000;

connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})