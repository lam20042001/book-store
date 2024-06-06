
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');

// Middleware for '/getWishlist'
async function getWishlist(req, res, next) {
    try {
        let user = req.session.user;
        req.session.user.discount = null;
        let id = user._id;
        let list = await Wishlist.findOne({ userId: id }).populate("wishlist.product");
        let wishcount = null;
        let count = null;
        if (user) {
            const cartItems = await Cart.findOne({ userId: user._id });
            if (cartItems) {
                count = cartItems.cart.length;
            }
        }
        if (user) {
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        res.render('user/wishlist', { list, user, wishcount, count });
    } catch (err) {
        // Pass the error to the next middleware
        err.status = 500;
        next(err);
    }
}

// Middleware for '/addToWishlist/:product'
async function addToWishlist(req, res, next) {
    try {
        let productid = req.params.product;
        let user = req.session.user;
        if (user) {
            let id = user._id;
            let wishlist = await Wishlist.findOne({ userId: id });
            if (!wishlist) {
                let newlist = new Wishlist({
                    userId: id,
                    wishlist: [{
                        product: productid,
                    }]
                });
                await newlist.save();
                res.json({ status: true, item: 'added' });
            } else {
                let list = wishlist.wishlist;
                let newItem = true;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].product == productid) {
                        newItem = false;
                    }
                }
                if (newItem) {
                    await Wishlist.findOneAndUpdate({ userId: id }, { $push: { wishlist: { product: productid } } })
                    res.json({ status: true, item: 'added' });
                } else {
                    await Wishlist.findOneAndUpdate({ userId: id }, { $pull: { wishlist: { product: productid } } })
                    res.json({ status: true, item: 'removed' });
                }
            }
        } else {
            res.json({ status: false });
        }
    } catch (err) {
        // Pass the error to the next middleware
        err.status = 500;
        next(err);
    }
}

// Middleware for '/deleteFromWishlist/:product'
async function deleteFromWishlist(req, res, next) {
    try {
        const user = req.session.user;
        const product = req.params.product;
        await Wishlist.findOneAndUpdate({ userId: user._id }, { $pull: { wishlist: { product: product } } });
        res.json({ status: true });
    } catch (err) {
        // Pass the error to the next middleware
        err.status = 500;
        next(err);
    }
}

module.exports = { getWishlist, addToWishlist, deleteFromWishlist };
