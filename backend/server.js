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