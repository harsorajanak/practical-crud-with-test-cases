const config = require('../../config/config');
const helper = require('../helpers/auth.helper');
var jwt = require('jsonwebtoken');
const user = require('../models/users');
var passwordHash = require('password-hash');


class AuthComponent {
    /*********************Social Login**********************/
    login = async (params) => {
        try {
            let login = await user.findOne({email: params.email}).select('password').lean();
            if(login){
                if(passwordHash.verify(params.password, login.password)){
                    delete login.password;
                    let response = {
                        access_token: jwt.sign(login, config.secret)
                    };
                    return  helper.success_with_data('Login successfully',response);
                } else {
                    return helper.error(401,'Invalid password, please check your password carefully!');
                }
            } else {
                return helper.error(401,'Invalid email address!');
            }
        } catch (e){
            return helper.error(401,e.message);
        }
    }

    register = async (params) => {
        try {
            let is_exists = await user.findOne({email: params.email});
            if(!is_exists){
                let data = {
                    first_name: params.first_name,
                    last_name: params.last_name,
                    email: params.email,
                    password: passwordHash.generate(params.password),
                }
                let create = (await user.create(data)).toObject();
                if(create){
                    let response = {
                        access_token: jwt.sign(create, config.secret)
                    };
                    return  helper.success_with_data('Your account registered successfully',response);
                } else {
                    return helper.error(400,'Something went wrong, please try again latter!');
                }
            } else {
                return helper.error(400,'You have already created account using this email, please try to login this account!');
            }
        } catch (e) {
            return helper.error(400,e.message);
        }
    }

    user_profile = async (usr) => {
        try {
            let _user = await user.findOne({_id:usr._id});
            return helper.success_with_data('User profile data found success',_user)
        } catch (e) {
            return helper.error(400,e.message);
        }
    }

    get_all_users = async () => {
        try {
            let users = await user.find();
            return helper.success_with_data('Users found success',users);
        } catch (e) {
            return helper.error(400,e.message);
        }

    }


    update_user = async (request) => {
        try {
            let id = request.params.id
            let params = request.fields

            let data = {};
            if(params.first_name){
                data.last_name = params.first_name
            }

            if(params.last_name){
                data.last_name = params.first_name
            }

            if(params.email){
                let findEmail = await user.findOne({email: params.email,_id : { $ne : id}});
                if(findEmail){
                    return helper.error(400,"Email already registered, please try with different email")
                }
                data.email = params.email
            }

            if(data) {
                await user.updateOne({_id: id},data,{ runValidators: true });
                return  helper.success('User details updated successfully')
            } else {
                return helper.error(400,"please pass at least one parameter")
            }
        } catch (e) {
            return helper.error(400,e.message);
        }
    }

    delete_user = async (request)  => {
        await user.deleteOne({_id: request.params.id});
        return helper.success("User delete successfully");
    }
}

module.exports = new AuthComponent();

