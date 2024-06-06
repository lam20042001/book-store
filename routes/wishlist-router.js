const express = require('express');
const auth = require('../middleware/auth');
const whishlistController = require('../controllers/whishlistController');
const wishlistRouter = express.Router();

// Route handler for '/'


wishlistRouter.get('/', auth.isUser, whishlistController.getWishlist);
wishlistRouter.get('/add/:product', whishlistController.addToWishlist);
wishlistRouter.get('/delete/:product', auth.isUser, whishlistController.deleteFromWishlist);

module.exports = wishlistRouter;
