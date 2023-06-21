const express =require('express');
const router = express.Router();
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware');
const {createBlogCategory,updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategories} = require('../controllers/BlogCatCtrl');


router.post('/',authMiddleware,isAdmin,createBlogCategory);
router.put('/:id',authMiddleware,isAdmin,updateBlogCategory);
router.get('/:id',getBlogCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteBlogCategory); 
router.get('/',getAllBlogCategories);
module.exports = router;