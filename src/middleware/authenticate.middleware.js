const config = require('../../config/config')
var jwt = require('jsonwebtoken');
const users = require('../models/users')
class AuthenticateMiddleware {
    isAuthenticate = (req,res,next) => {
        let token = req.headers.authorization;
        jwt.verify(token,config.secret, { algorithm: "HS256" }, async (err, user) => {
            if (err) {
                return res.status(401).json({ err_code:401,status:0,message:"Unauthorized" });
            }
            else{
                var user_id = user._id;
                var getUser = await users.findOne({_id:user_id});
                if(!getUser){
                    return res.status(401).json({ err_code:401,status:0,message:"Unauthorized" });
                } else {
                    return next();
                }
            }
        });
    }
}


module.exports = new AuthenticateMiddleware();
