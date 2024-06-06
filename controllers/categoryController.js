const fs = require('fs');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const getCategory = async function (req, res, next) {
    try {
        const count = await Category.countDocuments();
        const categories = await Category.find();
        const admin = req.session.admin;
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('admin/category', { categories, count, admin, success, error });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const getAddCategory = async function (req, res, next) {
    try {
        admin = req.session.admin;
        const title = "";
        const error = req.flash('error');
        res.render('admin/add-category', { admin, title, error });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const postAddCategory = async function (req, res, next) {
    try {
        let title = req.body.title.replace(/\s+/g, '-').toUpperCase();
        let image = typeof req.file !== "undefined" ? req.file.filename : "";
        const existingCategory = await Category.findOne({ title:title });
        if (existingCategory) {
            fs.unlink('public/images/category-img/' + image, (err) => {
                if (err) console.log(err);
            });
            req.flash('error', 'Category title exists, choose another.');
            return res.redirect('/admin/category/add-category');
        } else {
            let category = new Category({
                title,
            });
            await category.save();
            const categories = await Category.find();
            req.app.locals.categories = categories;
        }
        req.flash('success', 'Category added successfully!');
        res.redirect('/admin/category');
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const getEditCategory = async function (req, res, next) {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.render('admin/404');
        }
        const admin = req.session.admin;
        const error = req.flash('error');
        res.render('admin/edit-category', {
            admin,
            error,
            title: category.title,
            image: category.image,
            id: category._id
        });
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const postEditCategory = async function (req, res, next) {
    try {
        const { title, pimage } = req.body;
        const image = typeof req.file !== "undefined" ? req.file.filename : "";
        const id = req.params.id;
        const category = await Category.findOne({ title: title, _id: { $ne: id } });
        if (category) {
            fs.unlink('public/images/category-img/' + image, (err) => {
                if (err) console.log(err);
            });
            req.flash('error', 'Category name already exists!');
            return res.redirect('/admin/category/edit-category/' + id);
        } else {
            if (image !== "") {
                const cat = await Category.findByIdAndUpdate({ _id: id }, { $set: { title: title, image: image } });
                await cat.save();
                fs.unlink('public/images/category-img/' + pimage, (err) => {
                    if (err) console.log(err);
                });
                req.flash('success', `Category edited successfully!`);
                res.redirect('/admin/category');
            } else {
                const cat = await Category.findByIdAndUpdate({ _id: id }, { $set: { title: title, image: pimage } });
                await cat.save();
                req.flash('success', `Category edited successfully!`);
                res.redirect('/admin/category');
            }
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

const getDeleteCategory = async function (req, res, next) {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.redirect('/admin/*');
        }
        let cat = category.title;
        const products = await Product.find({ category: cat });
        if (products.length > 0) {
            req.flash('error', 'there are some products in this category.Cant delete it.');
            return res.redirect('/admin/category');
        } else {
            const catToDelete = await Category.findById(req.params.id);
            if (!catToDelete) {
                return res.redirect('/admin/*');
            }
            fs.unlink('public/images/category-img/' + catToDelete.image, (err) => {
                if (err) console.log(err);
            });
            await Category.deleteOne(catToDelete);
            req.flash('success', `Category deleted successfully!`);
            res.redirect('/admin/category');
        }
    } catch (err) {
        console.log(err);
        err.status = 500;
        next(err);
    }
};

module.exports = {
    getCategory,
    getAddCategory,
    postAddCategory,
    getEditCategory,
    postEditCategory,
    getDeleteCategory
};
