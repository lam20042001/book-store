const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   details: [{
      street: String,
      ward: String,
      district: String,
      city: String,
      contact: Number,
      select: { type: Boolean, default: false }
   }]
});
const Address = mongoose.model('Address', addressSchema);
module.exports = Address;