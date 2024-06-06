const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");
const Wishlist = require("../models/wishlistModel");

const getCart = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = user._id;
        let carts = await Cart.findOne({ userId: id }).populate("cart.product");
        let coupons = await Coupon.find({});
        let count = null;
        let sum = null;
        let discount = req.session.user.discount;
        if (carts) {
            let cart = carts.cart;
            sum = cart.reduce((sum, x) => {
                return sum + x.sub_total;
            }, 0);
            req.session.user.total = sum;
        }
        let shipping;
        if (sum > 500000) {
            shipping = 0;
        } else {
            shipping = 30000;
        }
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
        const error = req.flash("error");
        res.render("user/cart", {
            carts,
            user,
            error,
            count,
            sum,
            shipping,
            wishcount,
            discount,
            coupons,
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware to handle the "/discount-coupon" route
const applyDiscountCoupon = async (req, res, next) => {
    try {
        let code = req.body.code;
        let total = req.session.user.total;
        let c = await Coupon.findOne({ code: code });
        if (c) {
            let discount = c.discount;
            let date = new Date();
            let exDate = new Date(c.expiryDate);
            date = date.getTime();
            exDate = exDate.getTime();
            if (total >= c.minimum) {
                if (date > exDate) {
                    req.flash("error", "coupon expired!");
                    res.json({ status: false });
                } else {
                    req.session.user.discount = parseInt(
                        (req.session.user.total * discount) / 100
                    )
                    res.json({ status: true });
                }
            } else {
                req.flash("error", `Your total amount is less than ${c.minimum}`);
                res.json({ status: false });
            }
        } else {
            req.flash("error", "Invalid coupon!");
            res.json({ status: false });
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware to handle the "/add/:product" route
const addToCart = async (req, res, next) => {
    try {
        if (req.session.user) {
            let productid = req.params.product;
            let user = req.session.user;
            let product = await Product.findById(productid);
            let price = product.price;
            let id = user._id;
            let userCart = await Cart.findOne({ userId: id });
            if (!userCart) {
                let newcart = new Cart({
                    userId: id,
                    cart: [
                        {
                            product: productid,
                            quantity: 1,
                            price: price,
                            sub_total: price,
                        },
                    ],
                });
                await newcart.save();
            } else {
                let existingProduct = userCart.cart.find(item => item.product.toString() === productid);
                if (existingProduct) {
                    await Cart.findOneAndUpdate(
                        { userId: id, "cart.product": productid },
                        { $inc: { "cart.$.quantity": 1, "cart.$.sub_total": price } }
                    );
                } else {
                    await Cart.findOneAndUpdate(
                        { userId: id },
                        {
                            $push: {
                                cart: {
                                    product: productid,
                                    quantity: 1,
                                    price: price,
                                    sub_total: price,
                                },
                            },
                        }
                    );
                }
            }
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware to handle the "/change-quantity" route
const changeQuantity = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = user._id;
        let { proId, price, count, qty } = req.body;
        if (qty == 1 && count == -1) {
            res.json({ status: true });
        }
        if (count > 0) {
            await Cart.updateOne(
                { userId: id, "cart.product": proId },
                { $inc: { "cart.$.quantity": count, "cart.$.sub_total": price } }
            );
        } else {
            await Cart.updateOne(
                { userId: id, "cart.product": proId },
                { $inc: { "cart.$.quantity": count, "cart.$.sub_total": -price } }
            );
        }
        res.json({ status: true });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware to handle the "/place-order" route
const placeOrder = async (req, res, next) => {
    try {
        let user = req.session.user;
        let address = await Address.findOne({ userId: user._id });
        let total = req.session.user.total;
        let discount = req.session.user.discount;
        let shipping;
        if (total > 500000) {
            shipping = 0;
        } else {
            shipping = 30000;
        }
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
        res.render("user/place-order", {
            user,
            count,
            wishcount,
            address,
            total,
            shipping,
            discount,
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware to handle the "/place-order/select-address" route
const selectAddress = async (req, res, next) => {
    try {
        let addressIndex = req.body.addressIndex;
        let user = req.session.user;
        let address = await Address.findOne({ userId: user._id });
        let change = address.details.map((item) => {
            item.select = false;
            return item;
        });
        await Address.findOneAndUpdate(
            { userId: user._id },
            { $pull: { details: {} } }
        ).then((res) => {
            console.log(res);
        });
        await Address.findOneAndUpdate(
            { userId: user._id },
            { $push: { details: change } }
        ).then((res) => {
            console.log(res);
        });
        Address.findOne({ userId: user._id }).then((res) => {
            let item = res.details[addressIndex];
            item.select = true;
            res.save();
        });
        res.json({ status: true });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const user = req.session.user;
        const { product } = req.params;
        await Cart.findOneAndUpdate(
            { userId: user._id },
            { $pull: { cart: { product: product } } }
        );
        res.json({ status: true });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};


// Middleware to handle the "/payment" route
const makePayment = async (req, res, next) => {
    try {
        let user = req.session.user;
        let paymentMethod = req.body.payment;
        let total = req.session.user.total;
        let carts = await Cart.findOne({ userId: user._id }).populate("cart.product");
        let address = await Address.findOne({ userId: user._id });
        let selectAddress = address.details.filter((item) => {
            return item.select == true;
        });
        let cart = carts.cart;
        let shipping;
        if (total > 500000) {
            shipping = 0;
        } else {
            shipping = 30000;
        }
        let discount = req.session.user.discount ? req.session.user.discount : 0;
        let status = 'placed';
        let order = new Order({
            userId: user._id,
            address: selectAddress[0],
            orderDetails: cart,
            total: total,
            shipping: shipping,
            discount: discount,
            date: new Date(),
            status: status,
            deliveryDate: new Date(+new Date() + 24 * 60 * 60 * 1000),
        });
        order.save();
        await Cart.findByIdAndUpdate(
            { _id: carts._id },
            { $pull: { cart: {} } }
        ).then((res) => {
        });
        res.json({ codStatus: status });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const orderSuccess = async (req, res, next) => {
    try {
        let user = req.session.user;
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
        let total = req.session.user.total;
        let shipping;
        if (total > 500000) {
            shipping = 0;
        } else {
            shipping = 30000;
        }
        let discount = req.session.user.discount;
        res.render("user/order-success", {
            user,
            count,
            wishcount,
            total,
            shipping,
            discount,
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

module.exports = {
    getCart,
    applyDiscountCoupon,
    addToCart,
    changeQuantity,
    placeOrder,
    selectAddress,
    makePayment,
    orderSuccess,
    deleteProduct
}
