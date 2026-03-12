import express from 'express';
import dotenv from 'dotenv';

import { connectToDB } from './config/database.js'

dotenv.config();

const app = express();

connectToDB();

app.get('/', (req,res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to AI-Journal-App'
    })
});

app.listen(3000, () => {
    console.log('server is running on port 3000')
})