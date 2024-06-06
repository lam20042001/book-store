const express = require('express');
const adminRouter = express.Router();
const auth = require('../middleware/auth');

const adminController = require('../controllers/adminController');
adminRouter.get('/',adminController.getLogin);
adminRouter.post('/', adminController.postLogin);   
adminRouter.get('/dashboard', auth.isAdmin, adminController.getDashboard);
adminRouter.get('/logout', adminController.logout);
adminRouter.get('/users', auth.isAdmin, adminController.getUsers);
adminRouter.get('/users/block/:id', auth.isAdmin, adminController.blockUser);
adminRouter.get('/users/unblock/:id', auth.isAdmin, adminController.unblockUser);
module.exports = adminRouter
