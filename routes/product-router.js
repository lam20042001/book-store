const express = require('express');
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');
const multer = require('multer');


// Route handlers
const productRouter = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product-img');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });
// Route handlers
productRouter.get('/', auth.isAdmin, productController.getAllProducts);
productRouter.get('/add-product', auth.isAdmin, productController.getAddProduct);
productRouter.post('/add-product', upload.single('image'), productController.postAddProduct);
productRouter.get('/edit-product/:id', auth.isAdmin, productController.getEditProduct);
productRouter.post('/edit-product/:id', upload.single('image'), productController.postEditProduct);
productRouter.get('/delete-product/:id', auth.isAdmin, productController.deleteProduct);

module.exports = productRouter;
