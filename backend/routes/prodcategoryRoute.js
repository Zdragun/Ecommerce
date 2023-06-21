const express =require('express');
const router = express.Router();
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware');
const {createCategory,updateCategory, deleteCategory, getCategory, getAllCategories} = require('../controllers/prodcategoryCtrl');


router.post('/',authMiddleware,isAdmin,createCategory);
router.put('/:id',authMiddleware,isAdmin,updateCategory);
router.get('/:id',getCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteCategory); 
router.get('/',getAllCategories);
module.exports = router;