import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectToDB } from './config/database.js'

import { checkAuthentication } from './middleware/auth.js';

import journalRoute from './routes/journal.js'
import authRoute from './routes/auth.js'

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://polite-cliff-0015fdf00.1.azurestaticapps.net'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkAuthentication);

connectToDB();

app.get('/', (_req,res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to AI-Journal-App'
    })
});

app.use('/api/auth', authRoute);
app.use('/api/journal', journalRoute );


app.use((err, _req, res, _next) => {
    console.error(err.stack);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})