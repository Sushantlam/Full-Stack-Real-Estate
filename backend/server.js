// import express from "express";
// import client from "./config/redis.js";
// import  cacheMiddleWare  from "./middleware/cache.middleware.js";
// import { rateLimiter } from "./middleware/ratelimiter.middleware.js";
// const app = express();
// const PORT = 9000;


// app.get("/", (req, res) => {
//      res.send("Hello It's working..");
//   });


//   await client.connect()

// app.get("/post", rateLimiter(10,60), cacheMiddleWare("post_data"), (req,res)=>{
//     res.send()})
// app.listen(PORT,()=>{
//     console.log(`Server is running on PORT ${PORT}`)
// })



const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
//router
const userRoute = require("./routes/user.route.js")
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user", userRoute)


module.exports= app