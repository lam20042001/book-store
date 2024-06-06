const express = require("express");
const orderStatusRouter = express.Router();
const auth = require("../middleware/auth");
const orderStatusController = require("../controllers/orderStatusController");
orderStatusRouter.get("/", auth.isAdmin, orderStatusController.getOrderStatus);
orderStatusRouter.post("/change-status/:id", auth.isAdmin, orderStatusController.changeOrderStatus);

module.exports = orderStatusRouter;
