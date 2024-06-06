const fs = require('fs');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

let admin;

// Middleware function for the '/' route
const getAllProducts = async (req, res, next) => {
    try {
        const count = await Product.countDocuments();
        const products = await Product.find();
        admin = req.session.admin;
        const success = req.flash('success');
        res.render('admin/products', { products, count, success, admin });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware function for the '/add-product' route
const getAddProduct = async (req, res, next) => {
    try {
        const categories = await Category.find();
        admin = req.session.admin;
        const error = req.flash('error');
        res.render('admin/add-product', {
            admin,
            error,
            categories,
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware function for the '/add-product' POST route
const postAddProduct = async (req, res, next) => {
    try {
        let { description, price, year, author, category, special } = req.body;
        let title = req.body.title.toUpperCase();
        let image = typeof req.file !== "undefined" ? req.file.filename : "";
        const product = await Product.findOne({ title: title, category: category });
        if (product) {
            fs.unlink('public/images/product-img/' + image, (err) => {
                if (err) console.log(err);
            });
            req.flash('error', 'Product exists, choose another.');
            return res.redirect('/admin/product/add-product');
        } else {
            price = parseInt(price)
            const newProduct = new Product({
                title: title,
                author: author,
                year: year,
                description: description,
                price: price,
                category: category,
                image: image,
                special: special,
            });
            await newProduct.save();
            const products = await Product.find();
            req.app.locals.products = products;
        }
        req.flash('success', 'Product added!');
        res.redirect('/admin/product');
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware function for the '/edit-product/:id' route
const getEditProduct = async (req, res, next) => {
    try {
        const categories = await Category.find();
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.render('admin/404');
        }
        const admin = req.session.admin;
        const error = req.flash('error');
        const success = req.flash('success');
        let special = true;
        if (product.special == null || product.special == false) special = false;
        res.render('admin/edit-product', {
            admin,
            success: success,
            error: error,
            title: product.title,
            description: product.description,
            categories: categories,
            category: product.category,
            image: product.image,
            author: product.author,
            year: product.year,
            special: special,
            price: product.price,
            id: product._id,
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

// Middleware function for the '/edit-product/:id' POST route
const postEditProduct = async (req, res, next) => {
    try {
        let { title, pimage, description, price, category, special } = req.body;
        let image = typeof req.file !== "undefined" ? req.file.filename : "";
        let id = req.params.id;
        price = parseInt(price);
        const product = await Product.findOne({ title: title, category: category, _id: { $ne: id } });
        if (product) {
            fs.unlink('public/images/product-img/' + pimage, (err) => {
                if (err) console.log(err);
            });
            req.flash('error', 'Product exists, choose another name.');
            return res.redirect('/admin/product/edit-product/' + id);
        } else {
            const existingProduct = await Product.findById(id);
            if (existingProduct) {
                let img = image !== "" ? image : pimage;
                existingProduct.title = title;
                existingProduct.description = description;
                existingProduct.price = price;
                existingProduct.category = category;
                existingProduct.image = img;
                existingProduct.special = special;
                await existingProduct.save();
                if (image !== "") {
                    if (existingProduct.image !== "") {
                        fs.unlink('public/images/product-img/' + pimage, (err) => {
                            if (err) console.log(err);
                        });
                    }
                }
                req.flash('success', 'Product edited successfully.');
                res.redirect('/admin/product');
            } else {
                return res.render('admin/404');
            }
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};


// Middleware function for the '/delete-product/:id' route
const deleteProduct = async (req, res, next) => {
    try {
        const pro = await Product.findById(req.params.id);
        if (!pro) {
            const err = new Error();
            err.status = 500;
            throw err;
        }
        await fs.promises.unlink('public/images/product-img/' + pro.image);
        await Promise.all(pro.images.map(async (img) => {
            await fs.promises.unlink('public/images/product-img/' + img);
        }));
        await Product.deleteOne(pro);
        req.flash('success', 'Product deleted successfully!');
        res.redirect('/admin/product');
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

module.exports = { getAllProducts, getAddProduct, postAddProduct, getEditProduct, postEditProduct, deleteProduct };
