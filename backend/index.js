import express from 'express';
import dotenv from 'dotenv';

import { connectToDB } from './config/database.js'

import journalRoute from './routes/journal.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();

app.get('/', (_req,res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to AI-Journal-App'
    })
});

app.use('/api/journal', journalRoute );


app.use((err, _req, res, _next) => {
    console.error(err.stack);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
})