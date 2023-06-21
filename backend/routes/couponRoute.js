const express =require('express');
const router = express.Router();
const {createCoupon, updateCoupon, deleteCoupon, getAllCoupons} = require('../controllers/couponCtrl');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');

router.post('/',authMiddleware,isAdmin,createCoupon);
router.put('/:id',authMiddleware,isAdmin,updateCoupon);
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon);
router.get("/:id", authMiddleware, isAdmin, getAllCoupons);
router.get('/',authMiddleware,isAdmin, getAllCoupons);


module.exports = router;