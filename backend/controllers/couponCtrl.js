const Coupon = require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asynHandler = require("express-async-handler");

const createCoupon = asynHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }
    catch (error) {
        throw new Error(error);
    }

}
);

const updateCoupon = asynHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const updateCouponbyID = await Coupon.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateCouponbyID)
    } catch (error) {
        throw new Error(error)
    }
})
const deleteCoupon = asynHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const deleteCouponbyID = await Coupon.findByIdAndDelete(id)
        res.json(deleteCouponbyID)
    } catch (error) {
        throw new Error(error)
    } 
})



const getCoupon = asynHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const getAcouponID = await Coupon.findById(id)
        res.json(getAcouponID)
    } catch (error) {
        throw new Error(error)
    } 

})
const getAllCoupons = asynHandler(async(req,res)=>{
    try {
        const getAllCoups = await Coupon.find();
        res.json(getAllCoups);
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createCoupon,updateCoupon,deleteCoupon,getCoupon,getAllCoupons};