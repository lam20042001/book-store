const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    code: String,
    discount: Number,
    description: String,
    minimum: Number,
    startDate: String,
    expiryDate: String
});
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;