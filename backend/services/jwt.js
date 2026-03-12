import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.Secret;

function createToken(payload) {
    const token = jwt.sign(payload, secret, {expiresIn: '24h'});
    return token;
}

function checkToken(token) {
    if (!token) return null;
    try {
        const isMatch = jwt.verify(token, secret);
        return isMatch;
    } catch (error) {
        return null;
    }
}

export { createToken, checkToken };