const express = require('express');
const userProductController = require('../controllers/userProductController');
const userProductRouter = express.Router();


userProductRouter.get('/', userProductController.getAllProducts);
userProductRouter.get('/:category', userProductController.getProductsByCategory);
userProductRouter.get('/product-details/:id', userProductController.getProductDetails);

module.exports = userProductRouter;