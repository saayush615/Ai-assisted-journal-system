import express from 'express';
import { 
    handleUserRegistration,
    handleUserLogin,
    handleAuthentication
} from '../controllers/auth.js'

const router = express.Router();

router.post('/register', handleUserRegistration);
router.post('/login', handleUserLogin);

router.get('/me', handleAuthentication)

router.post('/logout', (_req,res) => { 
    res.clearCookie('uid');
    return res.status(200).json({
        success: true,
        message: 'Logout Successfull'
    });
 })

export default router;