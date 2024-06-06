const express = require('express');
const couponRouter = express.Router();
const auth = require('../middleware/auth');
const couponController = require('../controllers/couponController');
couponRouter.get('/', auth.isAdmin, couponController.getCoupons);
couponRouter.get('/add-coupon', auth.isAdmin, couponController.getAddCoupon);
couponRouter.post('/add-coupon', couponController.postAddCoupon);
couponRouter.get('/edit-coupon/:id', auth.isAdmin, couponController.getEditCoupon);
couponRouter.post('/edit-coupon/:id', couponController.postEditCoupon);
couponRouter.get('/delete-coupon/:id', auth.isAdmin, couponController.deleteCoupon);

module.exports = couponRouter;