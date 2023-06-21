const {default:mongoose} =require("mongoose");
const dbConnect  = () =>
{
    try {
        const conn = mongoose.connect(process.env.MONGOCONN)
        console.log("Database Connected Successfully");
        
    } catch (error) {
        console.log("Problems with DB Connection");
    }
}

module.exports = dbConnect;