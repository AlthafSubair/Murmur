import express from 'express';
import dotenv from 'dotenv';
import authRoute from './src/routes/authRoute.js'
import connectDB from './src/config/connectDB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRoute)


const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})