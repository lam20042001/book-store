const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

let admin;

const getLogin = async (req, res, next) => {
    try {
        if (req.session.admin)
            res.redirect('/admin/dashboard');
        else {
            const error = req.flash('error');
            res.render('admin/login-admin', { error: error });
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const adminData = await Admin.findOne({ email: email, password: password });
        if (adminData) {
            req.session.admin = true;
            res.redirect('/admin/dashboard');
        } else {
            req.flash('error', 'Incorrect email or password');
            return res.redirect('/admin');
        }
    } catch (err) {
        console.log(err)
        err.status = 500;
        next(err);
    }
};

const getDashboard = async (req, res, next) => {
    try {
        admin = req.session.admin;
        let productCount = await Product.countDocuments();
        let orderCount = await Order.countDocuments();
        let user = await User.aggregate([
            { $match: {} },
            {
                $group:
                {
                    _id: '$verified',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);
        let total = await Order.aggregate([
            {
                $match: {
                    status: 'delivered'
                }
            },
            {
                $group: {
                    _id: 'null',
                    total: {
                        $sum: '$total'
                    },
                    totalDisc: {
                        $sum: '$discount'
                    },
                    totalShip: {
                        $sum: '$shipping'
                    }
                }
            }
        ]);
        res.render('admin/dashboard', { productCount, total, user, orderCount });
    } catch (err) {
        console.log(err)
        err.status = 500;
        next(err);
    }
};


const logout = async (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (err) {
        console.log(err)
        err.status = 500;
        next(err);
    }
};

const getUsers = async (req, res, next) => {
    try {
        let count = await User.countDocuments();
        let users = await User.find();
        let admin = req.session.admin;
        res.render('admin/users', { users: users, admin, count });
    } catch (err) {
        console.log(err)
        err.status = 500;
        next(err);
    }
};

const blockUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: "true" });
        res.redirect('/admin/users');
    } catch (err) {
        console.log(err)
        err.status = 500;
        next(err);
    }
};

const unblockUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: "false" });
        res.redirect('/admin/users');
    } catch (err) {
        console.log(err)
        err.status = 500;
        next(err);
    }
};


module.exports = {
    getLogin,
    postLogin,
    getDashboard,
    logout,
    getUsers,
    blockUser,
    unblockUser
};
