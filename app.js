const express = require("express");
const path = require("path");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookie = require("cookie-parser");
const flash = require("connect-flash");
const nocache = require("nocache");
const userRouter = require("./routes/user-router");
const adminRouter = require("./routes/admin-router");
const categoryRouter = require("./routes/category-router");
const couponRouter = require("./routes/coupon-router");
const productRouter = require("./routes/product-router");
const profileRouter = require("./routes/profile-router");
const userProductRouter = require("./routes/user-product-router");
const cartRouter = require("./routes/cart-router");
const wishlistRouter = require("./routes/wishlist-router");
const orderRouter = require("./routes/order-router");
const Wishlist = require("./models/wishlistModel");
const Cart = require("./models/cartModel");
const orderStatusRouter = require("./routes/order-status-router");
const ejsMate = require("ejs-mate");
mongoose
    .connect("mongodb+srv://abcdef:05gOU0FCROsI6I60@book.0varj6g.mongodb.net/book?retryWrites=true&w=majority")
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Database connection failed" + err);
    });
mongoose.set('strictQuery', false)
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(nocache());
app.use(cookie("cookie-secret-key"));
app.use(
    session({
        secret: "session-secret-key",
        resave: true,
        saveUninitialized: true,
        cookie: { httpOnly: true, maxAge: 1000 * 3600 * 24, secure: false },
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());


app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/admin/category", categoryRouter);
app.use("/admin/product", productRouter);
app.use("/admin/orders", orderStatusRouter);
app.use("/admin/coupon", couponRouter);
app.use("/profile", profileRouter);
app.use("/products", userProductRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/orders", orderRouter);



app.all('/admin/*', (req, res, next) => {
    const err = new Error()
    err.status = 404
    next(err)
})
app.use('/admin/*', async (err, req, res, next) => {
    let admin = req.session.admin;
    if (err.status == 404)
        res.render("admin/404", { admin });
    else res.render("admin/500", { admin })
})

app.all('*', (req, res, next) => {
    const err = new Error()
    err.status = 404
    next(err)
})


app.use(async (err, req, res, next) => {
    let user = req.session.user;
    let count = null;
    if (user) {
        const cartItems = await Cart.findOne({ userId: user._id });
        if (cartItems) {
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
    if (user) {
        const wishlistItems = await Wishlist.findOne({ userId: user._id });
        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    if (err.status == 404) {
        res.render("user/404", { user, count, wishcount });
    }
    else res.render("user/500", { user, count, wishcount });

});
app.listen(port, () => {
    console.log(`Listening to the server on http://localhost:${port}`);
});

