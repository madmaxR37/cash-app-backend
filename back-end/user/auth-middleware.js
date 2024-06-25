const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){

    const authHeader = req.header('Authorization');
    const refresh_token = req.cookies.refreshToken;

    const access_token = authHeader.substring(7, authHeader.length);
    if(!authHeader && !refresh_token) return res.status(401).json({error:"access denied no token provided"});
    try{
        user = jwt.verify(access_token, 'your-secret-key');
        req.userId = user.userId;

        next();
    }catch(error){
        if(!refresh_token) return res.status(401).json({error:"refresh token not provided"});

try{
        const decoded = jwt.verify(refresh_token,'your-secret-key');
        const access_token = jwt.sign({userId:decoded.userId,role:decoded.role},'your-secret-key', {expiresIn: 60*15});
        res
                .cookie('resfreshToken', refresh_token,{httpOnly:true, sameSite:'strict'})
                .header('Authorization', access_token)
                .json({message:'token refreshed'});
}catch(error){
        return res.status(401).json({message:'invalid token'});
}
    }
}

module.exports = verifyToken;