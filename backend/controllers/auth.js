import Auth from "../models/auth.js";
import { setPassword, checkPassword } from '../services/bcrypt.js';
import { createToken } from '../services/jwt.js';

async function handleUserRegistration(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        };

        const existingUser = await Auth.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: 'This email is already registered'
            });
        };

        const hashedPassword = await setPassword(password);

        const user = await Auth.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: 'Registered Successfully!, Proceed to login',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        next(error);
    }
};


async function handleUserLogin(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await Auth.findOne({ email }).select('+password');
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'Email is not registered'
            });
        }

        const passwordvalidate = await checkPassword(password, user.password);
        if(!passwordvalidate){
            return res.status(400).json({
                success: false,
                message: 'Invalid Password'
            });
        };

        const token = createToken({ 
            id: user._id , 
            name: user.name, 
            email: user.email
        });

        res.cookie('uid',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export { 
    handleUserRegistration,
    handleUserLogin
}