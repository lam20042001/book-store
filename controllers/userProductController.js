const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');

// Middleware function for the '/' route
async function getAllProducts(req, res, next) {
    try {
        let products = await Product.find({});
        let categories = await Category.find({});
        let count = null;
        let list = null;
        const user = req.session.user;
        if (user) {
            req.session.user.discount = null;
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
            list = await Wishlist.findOne({ userId: req.session.user._id }).populate("wishlist.product");
        }
        res.render('user/products', { category: 'ALL', products, categories, user, count, wishcount, list });
    } catch (err) {
        err.status = 500;
        next(err);
    }
}

// Middleware function for the '/:category' route
async function getProductsByCategory(req, res, next) {
    try {
        let category = req.params.category;
        let checkCategory = await Category.findOne({ title: category });
        if (!checkCategory) {
            const err = new Error();
            err.status = 500;
            throw err;
        }
        let categories = await Category.find({});
        let products;
        if (category == 'ALL') products = await Product.find({})
        else products = await Product.find({ category: category });
        let count = null;
        const user = req.session.user;
        if (user) {
            const cartItems = await Cart.findOne({ userId: user._id });
            if (cartItems)
                count = cartItems.cart.length;
        }
        let wishcount = null;
        if (user) {
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        res.render('user/products', { category, products, categories, user, count, wishcount });
    } catch (err) {
        err.status = 500;
        next(err);
    }
}

// Middleware function for the '/product-details/:id' route
async function getProductDetails(req, res, next) {
    try {
        let id = req.params.id;
        let product = await Product.findById(id);
        const user = req.session.user;
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
        res.render('user/single-product', { product, user, count, wishcount });
    } catch (err) {
        err.status = 500;
        next(err);
    }
}

module.exports = { getAllProducts, getProductsByCategory, getProductDetails };
