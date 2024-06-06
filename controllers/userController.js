const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (err) {
        console.log(err);
        err.status = 500;
        throw err;
    }
};

// GET /
const homepage = async (req, res, next) => {
    try {
        const user = req.session.user;
        const categories = await Category.find({});
        const specials = await Product.find({ special: true });
        let count = null;
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
        }
        res.render("user/homepage", {
            user,
            categories,
            specials,
            count,
            wishcount,
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// GET /register
const registerPage = async (req, res, next) => {
    try {
        if (req.session.user) res.redirect("/home");
        else {
            const error = req.flash("error");
            const success = req.flash("success");
            res.render("user/signup", {
                user: null,
                count: null,
                wishcount: null,
                error: error,
                success: success,
            });
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// POST /register
const register = async (req, res, next) => {
    try {
        const { name, email, contact, password, image } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            req.flash(
                "error",
                `This Email is already registered  in the name '${user.name}'`
            );
            return res.redirect("/register");
        }
        const spassword = await securePassword(password);
        user = new User({
            name: name,
            email: email,
            contact: contact,
            password: spassword,
            verified: true,
            image: image,
            status: false,
        });
        await user.save();
        let address = new Address({
            userId: user._id,
            details: [],
        });
        await address.save();
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// GET /login
const loginPage = async (req, res, next) => {
    try {
        req.session.account = null;
        if (req.session.user) {
            res.redirect("/");
        } else {
            const error = req.flash("error");
            const success = req.flash("success");
            const user = null;
            const count = null;
            const wishcount = null;
            res.render("user/login", {
                user,
                count,
                wishcount,
                error,
                success,
            });
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// POST /login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            req.flash("error", "No User found!");
            return res.redirect("/login");
        }
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            req.flash("error", "Your Password is wrong!");
            return res.redirect("/login");
        }
        if (userData.status) {
            req.flash("error", "Your account is blocked by admin.");
            return res.redirect("/login");
        }
        req.session.user = userData;
        res.redirect("/");
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// POST /change-password/:id
const changePassword = async (req, res, next) => {
    try {
        let { npassword } = req.body;
        let id = req.params.id;
        let spassword = await securePassword(npassword);
        let user = await User.findById(id);
        user.password = spassword;
        await user.save();
        req.flash("success", "Password changed successfully");
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// GET /about
const about = async (req, res, next) => {
    try {
        const user = req.session.user;
        let count = null;
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
        }
        res.render("user/about", { user, count, wishcount });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// POST /search
const search = async (req, res, next) => {
    try {
        let payload = req.body.payload.trim();
        let category = req.body.category.trim();
        let search = null;
        if (category == "All") {
            search = await Product.find({
                title: { $regex: new RegExp(payload + ".*", "i") },
            });
        } else {
            search = await Product.find({
                title: { $regex: new RegExp(payload + ".*", "i") },
                category: category,
            });
        }
        res.json({ payload: search });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// GET /logout
const logout = async (req, res, next) => {
    try {
        req.session.user = null;
        req.flash("success", "You are logged out successfully!");
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

module.exports = {
    homepage,
    registerPage,
    register,
    loginPage,
    login,
    changePassword,
    about,
    search,
    logout,
};
