// import client from "../config/redis.js"


// const cacheMiddleWare =( key) => async(req,res,next)=>{
//     try {
//         console.log("key", key);
//         const redisKey = key || req.originalUrl
//         const cacheData = await client.get(redisKey)
//         if(cacheData){
//             // console.log("cached data", cacheData);
//             return res.json(JSON.parse(cacheData))  
//         }
//         const newCacheData = res.json.bind(res);
//         res.json=(body)=>{
//             client.setEx(redisKey, 600, JSON.stringify(body))
//             newCacheData(body)
//         }
//         next()
//     } catch (error) {
//         console.error('Redis cache error:', error);
//     }
// }

// export default cacheMiddleWare