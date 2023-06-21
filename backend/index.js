const express =require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect")
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const categoryRoute = require("./routes/prodcategoryRoute");
const blogCatRoute =require("./routes/blogCatRoute");
const brandRoute = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRoute = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const { errorKeeper, ErrorNotFound } = require("./middlewares/errorHandle");
const cookieParser =require('cookie-parser')
const morgan =require('morgan');
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
dbConnect();
app.use(cors()) 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));
app.use("/api/user",authRoute);
app.use("/api/product",productRoute)
app.use("/api/blog",blogRoute);
app.use("/api/category",categoryRoute)
app.use("/api/blogcategory",blogCatRoute);
app.use("/api/brand",brandRoute);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/coupon",couponRoute);
app.use("/api/upload", uploadRouter);
app.use(ErrorNotFound);
app.use(errorKeeper)
app.listen(port,()=>console.log(`The server is running on port ${port}`));