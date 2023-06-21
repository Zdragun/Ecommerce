const express =require('express');
const router = express.Router();
const {createUser,getAllOrders /* getOrderByUserId */, loginUser, getallUser, getUser,forgotPasswordToken, deleteUser, updateUser, blockedUser, unBlockedUser, handleRefreshToken, logout,updatePassword, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, /* emptyCart, applyCoupon, */ createOrder, /* getOrders, updateOrderStatus, */ removeProductFromCart, updateProductQuantityinCart, getMyneOrder, getSingleOrder, UpdateOrder} = require('../controllers/userCtrl');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const { checkout, paymentVerification } = require('../controllers/paymentCtrl');


router.post("/register",createUser);
router.post("/forgot-password-token",forgotPasswordToken);
router.put("/reset-password/:token",resetPassword);
router.put('/password',authMiddleware,updatePassword);
/* router.put('/order/update-order/:id',authMiddleware,isAdmin, updateOrderStatus) */
/* router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId); */
router.post("/login",loginUser);
router.post("/admin-login",loginAdmin);
router.post("/cart/create-order", authMiddleware, createOrder)
/* router.post("/cart/applycoupon", authMiddleware, applyCoupon) */
router.post("/order/checkout",authMiddleware,checkout)
router.post("/order/paymentVerification",authMiddleware,paymentVerification)
router.post("/cart",authMiddleware, userCart)
router.get("/wishlist",authMiddleware,getWishlist)
router.get("/cart",authMiddleware,getUserCart);
router.get("/all-users",getallUser);
router.get("/getmyorders",authMiddleware,getMyneOrder);
router.get("/getanOrder/:id",authMiddleware,isAdmin,getSingleOrder);
router.put("/updateOrder/:id",authMiddleware,isAdmin,UpdateOrder);
/* router.get("/get-orders", authMiddleware, getOrders); */
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get('/refresh',handleRefreshToken);
router.get('/logout',logout);
router.get("/:id",authMiddleware, isAdmin, getUser);
router.get("")
/* router.delete("/empty-cart",authMiddleware, emptyCart) */
router.delete("/:id",deleteUser);
router.delete("/delete-product-cart/:cartItemId",authMiddleware,removeProductFromCart)
router.delete("/update-product-cart/:cartItemId/:newQuantity",authMiddleware,updateProductQuantityinCart)
router.put("/edit-user",authMiddleware, updateUser);
router.put("/save-address",authMiddleware,saveAddress)
router.put("/blocked-user/:id",authMiddleware, isAdmin, blockedUser);
router.put("/unblocked-user/:id",authMiddleware,isAdmin, unBlockedUser);

module.exports = router;