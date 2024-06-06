const Coupon = require('../models/couponModel');

// Middleware function for the '/admin/coupon' route
const getCoupons = async function (req, res, next) {
    try {
        const count = await Coupon.countDocuments();
        const coupons = await Coupon.find();
        admin = req.session.admin;
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('admin/coupons', { coupons, count, admin, success, error });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
}

// Middleware function for the '/admin/coupon/add-coupon' route
const getAddCoupon = async function (req, res, next) {
    admin = req.session.admin;
    const error = req.flash('error');
    res.render('admin/add-coupon', { admin, error });
}

// Middleware function for the '/admin/coupon/add-coupon' route
const postAddCoupon = async function (req, res, next) {
    try {
        let { code, discount, expiryDate, description, minimum } = req.body;
        let date = new Date();
        startDate = date.toDateString();
        expiryDate = new Date(expiryDate).toDateString();
        const existingCoupon = await Coupon.findOne({ code: code });
        if (existingCoupon) {
            req.flash('error', 'Coupon already exists, choose another.');
            return res.redirect('/admin/coupon/add-coupon');
        } else {
            const newCoupon = new Coupon({
                code: code,
                discount: discount,
                minimum: minimum,
                description: description,
                startDate: date,
                expiryDate: expiryDate
            });
            await newCoupon.save();
        }
        req.flash('success', 'Coupon added successfully!');
        res.redirect('/admin/coupon');
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
}

// Middleware function for the '/admin/coupon/edit-coupon/:id' route
const getEditCoupon = async function (req, res, next) {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.redirect('admin/404');
        }
        const admin = req.session.admin;
        const error = req.flash('error');
        res.render('admin/edit-coupon', {
            admin,
            error,
            id: coupon._id,
            code: coupon.code,
            discount: coupon.discount,
            minimum: coupon.minimum,
            description: coupon.description,
            expiryDate: coupon.expiryDate
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
}

// Middleware function for the '/admin/coupon/edit-coupon/:id' route
const postEditCoupon = async function (req, res, next) {
    try {
        let { code, discount, expiryDate, description, minimum } = req.body;
        expiryDate = new Date(expiryDate).toDateString();
        let id = req.params.id;
        const existingCoupon = await Coupon.findOne({ code: code, _id: { $ne: id } });
        if (existingCoupon) {
            req.flash('error', 'Coupon already exists!');
            return res.redirect('/admin/coupon/edit-coupon/' + id);
        } else {
            const updatedCoupon = await Coupon.findByIdAndUpdate({ _id: id }, { $set: { code: code, discount: discount, expiryDate: expiryDate, description: description, minimum: minimum } });
            if (updatedCoupon) {
                req.flash('success', `Coupon edited successfully!`);
                res.redirect('/admin/coupon');
            } else {
                return res.render('admin/404');
            }
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
}

// Middleware function for the '/admin/coupon/delete/:id' route
const deleteCoupon = async function (req, res, next) {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.redirect('admin/404');
        }
        await Coupon.deleteOne(coupon);
        req.flash('success', `Coupon deleted successfully!`);
        res.redirect('/admin/coupon');
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
}

module.exports = { getCoupons, getAddCoupon, postAddCoupon, getEditCoupon, postEditCoupon, deleteCoupon };
