import mongoose from 'mongoose';

const authSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email']
    },
    password: {
        type: String,
        minlength: [6, 'Password should be at least 6 characters'],
        select: false
    }
}, {timestamps: true});

export default mongoose.model('Auth', authSchema);