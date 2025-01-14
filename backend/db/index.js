const mongoose = require("mongoose")
const DB_NAME = require("../constant.js")

const connectDB =async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        // console.log("MONGODB connection  ", connection);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

module.exports = connectDB