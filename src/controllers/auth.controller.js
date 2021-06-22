const authComponent = require('../components/auth.component');
const helper = require('../helpers/auth.helper')
class AuthController {
    login = async (req, res) => {
        let params = req.fields;
        let data = await authComponent.login(params);
        return res.status(data.err_code).json(data);
    };
    register = async (req, res) => {
        let params = req.fields;
        let data = await authComponent.register(params);
        return res.status(data.err_code).json(data);
    };

    user_profile = async (req, res) => {
        let user = await helper.get_user(req);
        let data = await authComponent.user_profile(user);
        return res.status(data.err_code).json(data);
    };

    get_all_users = async (req, res) => {
        let data = await authComponent.get_all_users();
        return res.status(data.err_code).json(data);
    };

    update_user = async (req, res) => {
       let data = await authComponent.update_user(req);
        return res.status(data.err_code).json(data);
    };

    delete_user = async (req, res) => {
       let data = await authComponent.delete_user(req);
        return res.status(data.err_code).json(data);
    };
}
module.exports = new AuthController();