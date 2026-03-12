import express from 'express';

const app = express();

app.get('/', (req,res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to AI-Journal-App'
    })
});

app.listen(3000, () => {
    console.log('server is running on port 3000')
})