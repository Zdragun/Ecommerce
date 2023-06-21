const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ], 
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ], 
    image:{
        type:String,
        default:"https://images.ctfassets.net/hrltx12pl8hq/2JVN7glHv8PRyML5X6m20u/bcaec97f32ad79621948e16fc5c130a9/shutterstock_1355665841.jpg?fit=fill&w=560&h=315&fm=webp"
    },
    author:
    {
        type:String,
        default:"Admin"

    },
    images:[],
},{toJSON:{virtuals:true},toObject:{virtuals:true}, timestamps:true});

module.exports = mongoose.model("Blog",blogSchema);