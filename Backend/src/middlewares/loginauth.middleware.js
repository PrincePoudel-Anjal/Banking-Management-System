const jwt = require('jsonwebtoken');
function loginmiddleware(req,res,next){
    const token = req.cookies?.token;
    if(!token){
        return res.status(402).json({
            message:"Please login First!"
        });
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {
            userId : decoded.userId,
        };
    }catch(error){
        return res.status(401).json({
            message:"Login Invalid!"
        });
    }
    next();
}
module.exports = loginmiddleware;




