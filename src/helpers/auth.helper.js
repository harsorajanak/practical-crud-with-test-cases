const config = require('../../config/config')
var jwt = require('jsonwebtoken');

class AuthHelper{
    success = (msg) => {
        return {
            status: true,
            message: msg,
            err_code: 200
        }
    }

    error = (code=401,msg) => {
        return {
            status : false,
            message: msg,
            err_code: code
        }
    }

    success_with_data = (msg,data) => {
        return {
            status: true,
            message: msg,
            data: data,
            err_code: 200
        }
    }

    get_user = async (req) => {
        let token = req.headers.authorization;
        return await jwt.verify(token,config.secret, { algorithm: "HS256" });
    }
}

module.exports = new AuthHelper();
