const express = require('express');
const router = express.Router();
const authController = require('../src/controllers/auth.controller')
const authMiddleware = require('../src/middleware/authenticate.middleware')

//auth routes
router.post('/api/auth/login', authController.login);
router.post('/api/auth/register', authController.register);

//Authorized routes
router.get('/api/user_profile', authMiddleware.isAuthenticate, authController.user_profile);
router.get('/api/get_all_users', authMiddleware.isAuthenticate, authController.get_all_users);
router.put('/api/user/:id', authMiddleware.isAuthenticate, authController.update_user);
router.delete('/api/user/delete/:id', authMiddleware.isAuthenticate, authController.delete_user);



module.exports = router;