
const Address = require('../models/addressModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
}

// Handler function for GET /profile
const getProfile = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = user._id;
        req.session.user.discount = null;
        const userData = await User.findOne({ _id: id });
        let address = await Address.findOne({ userId: id });
        const error = req.flash('error');
        const success = req.flash('success');
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
        res.render('user/user-profile', { user: userData, address, success, error, count, wishcount });
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

const editProfile = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = user._id;
        let { name, email, contact, pimage } = req.body;
        let image = typeof req.file !== "undefined" ? req.file.filename : "";
        let foundUser = await User.findById(id);
        if (image == "") {
            foundUser.name = name;
            foundUser.image = pimage;
            foundUser.contact = contact;
            await foundUser.save();
            res.redirect('/profile');
        } else {
            foundUser.name = name;
            foundUser.image = image;
            foundUser.contact = contact;
            await foundUser.save();
            if (image !== "") {
                if (foundUser.image !== "") {
                    fs.unlink('public/images/user-img/' + pimage, (err) => {
                        if (err) console.log(err);
                    });
                }
            }
            res.redirect('/profile');
        }
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

const addAddress = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = user._id;
        let { ward, street, contact, district, city } = req.body;

        let addressbook = await Address.findOne({ userId: id });
        if (addressbook.details.length > 0) {
            await Address.findOneAndUpdate({ userId: id }, {
                $push: {
                    details: {
                        ward: ward, street: street, contact: contact, district: district, city: city
                    }
                }
            });
        } else {
            await Address.findOneAndUpdate({ userId: id }, {
                $push: {
                    details: {
                        ward: ward, street: street, contact: contact, district: district, city: city, select: true
                    }
                }
            });
        }
        res.redirect('back');
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

const editAddress = async (req, res, next) => {
    try {
        let user = req.session.user;
        let index = req.params.index;
        let { ward, street, contact, city } = req.body;

        let address = await Address.findOne({ userId: user._id });
        address.details[index].ward = ward;
        address.details[index].street = street;
        address.details[index].contact = contact;
        address.details[index].district = district;
        address.details[index].city = city;
        await address.save();
        res.redirect('back');
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        let index = req.params.index;
        let user = req.session.user;
        let address = await Address.findOne({ userId: user._id });
        let ad = address.details[index];
        address.details.pull(ad);
        await address.save();
        res.redirect('back');
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        let user = req.session.user;
        let id = user._id;
        let { password, npassword } = req.body;
        const spassword = await securePassword(password);
        const snpassword = await securePassword(npassword);
        const passwordMatch = await bcrypt.compare(spassword, user.password);
        if (passwordMatch) {
            await User.findByIdAndUpdate((id), { $set: { password: snpassword } });
            req.flash('success', 'Your password updated successfully.');
            res.redirect('/profile');
        } else {
            req.flash('error', 'Current password is wrong!');
            res.redirect('/profile');
        }
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

module.exports = { getProfile, editProfile, addAddress, editAddress, deleteAddress, changePassword };
