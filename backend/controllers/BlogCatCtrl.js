const BlogCategory = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");

const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newBlogCategory = await BlogCategory.create(req.body);
        res.json(newBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const deleteBlogCategoryId = await BlogCategory.findByIdAndDelete(id);
        res.json(deleteBlogCategoryId);
    } catch (error) {
        throw new Error(error);
    }

})

const getBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaBlogCategory = await BlogCategory.findById(id);
        res.json(getaBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogCategories = asyncHandler(async (req, res) => {

    try {
        const getCategories = await BlogCategory.find();
        res.json(getCategories);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBlogCategory, updateBlogCategory, deleteBlogCategory,getBlogCategory,getAllBlogCategories };