const express =require('express');
const router = express.Router();
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware');
const {createBlog, updateBlog, getBlog, getAllBlogs, deletedBlog, likeBlog, dislikeBlog, uploadImages} = require('../controllers/BlogCtrl');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');


router.post('/',authMiddleware,isAdmin,createBlog);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",2),blogImgResize,uploadImages)
router.put('/likes',authMiddleware,likeBlog);
router.put('/dislikes',authMiddleware,dislikeBlog);
router.put('/:id',authMiddleware,isAdmin,updateBlog);
router.get('/:id',getBlog);
router.get('/',getAllBlogs)
router.delete('/:id',authMiddleware,isAdmin,deletedBlog);
module.exports = router;