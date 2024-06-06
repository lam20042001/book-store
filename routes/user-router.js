const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

// Assign the handler functions to the respective routes
userRouter.get("/", userController.homepage);
userRouter.get("/register", userController.registerPage);
userRouter.post("/register", userController.register);
userRouter.get("/login", userController.loginPage);
userRouter.post("/login", userController.login);
userRouter.post("/change-password/:id", userController.changePassword);
userRouter.get("/about", userController.about);
userRouter.post("/search", userController.search);
userRouter.get("/logout", userController.logout);

module.exports = userRouter;
