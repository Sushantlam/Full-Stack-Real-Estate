// import client from "../config/redis.js";


// export const rateLimiter =(limit,timer)=>async(req,res, next)=>{
//     try {
//         const userKey = `rate-limit:${req.ip}`;
//         console.log("userKey", userKey);
        
//         const requestCount = await client.incr(userKey)
//         if(requestCount===1){
//             await client.expire(userKey, timer)
//         }
//         if (requestCount > limit) {
//             // Exceeded the limit
//             return res.status(429).json({ error: "Too many requests, please try again later." });
//           }
//           next()
//     } catch (error) {
//         console.log("error", error);
//     }
// }