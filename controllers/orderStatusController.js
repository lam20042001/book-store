const Order = require("../models/orderModel");

async function getOrderStatus(req, res, next) {
    try {
        let admin = req.session.admin;
        let count = await Order.countDocuments();
        let orders = await Order.find({}).populate([
            { path: "userId", model: "User" },
            {
                path: "orderDetails",
                populate: {
                    path: "product",
                    model: "Product",
                },
            },
        ]);
        let success = req.flash("success");
        let error = req.flash("error");
        let status = ["placed", "shipped", "cancelled", "delivered"];
        res.render("admin/orders", { admin, count, orders, success, error, status });
    } catch (err) {
        // Pass the error to the next middleware
        err.status = 500;
        next(err);
    }
}

async function changeOrderStatus(req, res, next) {
    try {
        let { status } = req.body;
        let id = req.params.id;
        let order = await Order.findById(id);
        order.status = status;
        await order.save();
        res.json({ status: true });
    } catch (err) {
        // Pass the error to the next middleware
        err.status = 500;
        next(err);
    }
}

module.exports = { getOrderStatus, changeOrderStatus };
