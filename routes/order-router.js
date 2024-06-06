const express = require("express");
const orderRouter = express.Router();
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");
orderRouter.get("/", auth.isUser, orderController.getOrders);
orderRouter.get("/order-details/:id", auth.isUser, orderController.getOrderDetails);
orderRouter.get("/order-cancel/:id", orderController.cancelOrder);
module.exports = orderRouter;