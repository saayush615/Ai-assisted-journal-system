import { checkToken } from '../services/jwt.js';

async function checkAuthentication(req,_res,next) {
    const userUid = req.cookies?.uid;

    req.user = null;

    if(!userUid){
        return next();
    }
    const user = checkToken(userUid);
    if(!user){
        return next();
    }

    req.user = user;
    return next();

}

export { checkAuthentication };