const Wishlist = require("../models/wishlistModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");

// Middleware function for the "/" route
const getOrders = async (req, res, next) => {
    try {
        let user = req.session.user;
        req.session.user.discount = null;
        let count = null;
        if (user) {
            const cartItems = await Cart.findOne({ userId: user._id });
            if (cartItems) {
                count = cartItems.cart.length;
            }
        }
        let wishcount = null;
        if (user) {
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        const order = await Order.find({ userId: user._id })
            .populate([
                {
                    path: "orderDetails",
                    populate: {
                        path: "product",
                        model: "Product",
                    },
                },
            ])
            .sort({ date: -1 });
        res.render("user/orders", { user, count, wishcount, order });
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

// Middleware function for the "/order-details/:id" route
const getOrderDetails = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = req.params.id;
        let count = null;
        if (user) {
            const cartItems = await Cart.findOne({ userId: user._id });
            if (cartItems) {
                count = cartItems.cart.length;
            }
        }
        let wishcount = null;
        if (user) {
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        const order = await Order.findById(id)
            .populate([
                {
                    path: "orderDetails",
                    populate: {
                        path: "product",
                        model: "Product",
                    },
                },
            ]);
        res.render("user/order-single-details", {
            user,
            count,
            wishcount,
            order,
        });
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

// Middleware function for the "/order-cancel/:id" route
const cancelOrder = async (req, res, next) => {
    try {
        let id = req.params.id;
        const item = await Order.findById(id);
        item.status = "cancelled";
        await item.save();
        res.json({ status: true });
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

module.exports = { getOrders, getOrderDetails, cancelOrder };
