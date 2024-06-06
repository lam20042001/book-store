const express = require("express");
const cartRouter = express.Router();


const auth = require("../middleware/auth");


const cartController = require("../controllers/cartController");
cartRouter.get("/", auth.isUser, cartController.getCart);
cartRouter.post("/discount-coupon", cartController.applyDiscountCoupon);
cartRouter.get("/add/:product", cartController.addToCart);
cartRouter.post("/change-quantity", auth.isUser, cartController.changeQuantity);
cartRouter.get("/place-order", auth.isUser, cartController.placeOrder);
cartRouter.post("/place-order/select-address", auth.isUser, cartController.selectAddress);
cartRouter.post("/payment", auth.isUser, cartController.makePayment);
cartRouter.get("/place-order/success", auth.isUser, cartController.orderSuccess);
cartRouter.get("/delete/:product", auth.isUser, cartController.deleteProduct);

module.exports = cartRouter;