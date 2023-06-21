const express =require('express');
const router = express.Router();
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware');
const {createBrand,updateBrand,getBrand,deleteBrand,getAllBrands} = require('../controllers/BrandCtrl');


router.post('/',authMiddleware,isAdmin,createBrand);
router.put('/:id',authMiddleware,isAdmin,updateBrand);
router.get('/:id',getBrand);
router.delete('/:id',authMiddleware,isAdmin,deleteBrand); 
router.get('/',getAllBrands);
module.exports = router;