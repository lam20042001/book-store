const express = require('express');
const profileController = require('../controllers/profileController');
const profileRouter = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/user-img');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage })
// Route handlers
profileRouter.get('/', auth.isUser, profileController.getProfile);
profileRouter.post('/edit-profile', auth.isUser, upload.single('image'), profileController.editProfile);
profileRouter.post('/add-address', auth.isUser, profileController.addAddress);
profileRouter.post('/edit-address/:index', auth.isUser, profileController.editAddress);
profileRouter.get('/delete-address/:index', auth.isUser, profileController.deleteAddress);
profileRouter.post('/change-password', auth.isUser, profileController.changePassword);

module.exports = profileRouter;