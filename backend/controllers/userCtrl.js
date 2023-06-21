const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require('jsonwebtoken')
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel')
const Order = require("../models/orderModel");
const uniqid = require('uniqid');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require("../utils/validateMongodbId");
const sendEmail = require("./emailCtrl");
const crypto = require('crypto');


const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const newUser = await User.create(req.body)
        res.json(newUser);
    }
    else {
        throw new Error("User Alredy Exists");
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
})


//admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findAdmin = await User.findOne({ email })
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id,
            {
                refreshToken: refreshToken
            },
            { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)

        })
    }
    else {
        throw new Error("Incorrect Credentials for login");
    }
})



const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find().populate("wishlist");
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {

        const singleUser = await User.findById(id)
        res.json(singleUser)
    } catch (error) {
        throw new Error(error)
    }

})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {

        const delOfUser = await User.findByIdAndDelete(id)
        res.json(delOfUser)
    } catch (error) {
        throw new Error(error)
    }

})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id)
    try {
        const updOfUser = await User.findByIdAndUpdate(_id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            {
                new: true
            }
        )
        res.send(updOfUser);
    } catch (error) {
        throw new Error(error);
    }
})

const blockedUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const block = await User.findByIdAndUpdate(id, { isBlocked: true, }, { new: true })
        res.json(block)
    } catch (error) {
        throw new Error(error)
    }
})
const unBlockedUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const unblock = await User.findByIdAndUpdate(id, { isBlocked: false, }, { new: true })
        res.json(unblock)
    } catch (error) {
        throw new Error(error)
    }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh token containerd in db or they are not equal");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("Smth is wrong with refresh token");
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204);
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});


const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Follow this link to reset Your Password.<a href='http://localhost:${3000 || 3001}/reset-password/${token}'>Click Here`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };

        console.log(data);
        sendEmail(data)

        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});


const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(req.user);
    try {
        const findUser = await User.findById(_id).populate('wishlist')
        res.json(findUser);
    } catch (error) {
        throw new Error(error)
    }
})


const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;

    validateMongodbId(_id)
    try {
        const saveAddr = await User.findByIdAndUpdate(_id,
            {
                address: req?.body?.address
            },
            {
                new: true
            }
        )
        res.send(saveAddr);
    } catch (error) {
        throw new Error(error);
    }
});


const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body
    const { _id } = req.user;
    validateMongodbId(_id);
    try {

        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            price,
            quantity
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});


const getUserCart = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.find({ userId: _id }).populate("productId").populate("color")
        res.json(cart);
    } catch (error) {
        throw new Error(error)
    }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongodbId(_id);
    try {
        const deleteProductFromCart = await Cart.deleteOne({ userId: _id, _id: cartItemId })
        res.json(deleteProductFromCart);
    } catch (error) {
        throw new Error(error);
    }
})
const updateProductQuantityinCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId,newQuantity } = req.params;
    validateMongodbId(_id);
    try {
        const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId })
        cartItem.quantity = newQuantity;
        cartItem.save();
        res.json(cartItem);
    } catch (error) {
        throw new Error(error);
    }
})

const createOrder = asyncHandler(async (req, res) => {
    const {shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo} = req.body;
    const { _id } = req.user;
  
    try {
        const order = await Order.create({shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo,user:_id});
        res.json({order,success:true});
    } catch (error) {
        throw new Error(error);
    }
});
const getMyneOrder = asyncHandler(async (req,res)=>
{
    const { _id } = req.user;
  
    try {
        const order = await Order.find({user:_id}).populate("user").populate("orderItems.product").populate("orderItems.color")
        res.json({order});
    } catch (error) {
        throw new Error(error);
    }
})

const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const orders = await Order.find().populate("user")

      res.json({orders});
    } catch (error) {
      throw new Error(error);
    }
  });


  const getSingleOrder = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const orders = await Order.findOne({_id:id}).populate('orderItems.product').populate('orderItems.color')
      res.json(
        {orders}
        );
    } catch (error) {
      throw new Error(error);
    }
  });
  const UpdateOrder = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const orders = await Order.findById(id)
      orders.orderStatus = req.body.status;
      await orders.save();
      res.json(
        {orders}
        );
    } catch (error) {
      throw new Error(error);
    }
  });
module.exports = { UpdateOrder, getSingleOrder, updateProductQuantityinCart,  getAllOrders,getMyneOrder, createOrder,removeProductFromCart/*getOrders */, getUserCart, /* applyCoupon, emptyCart, */ getWishlist, userCart, saveAddress, loginAdmin, createUser, logout, resetPassword, handleRefreshToken, loginUser, getallUser, getUser, deleteUser, updateUser, blockedUser, unBlockedUser, updatePassword, forgotPasswordToken };