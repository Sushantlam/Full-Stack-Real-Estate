
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        console.log("yeta ako chaa");
        await fn(req, res, next)
    } catch (error) {
        console.log("error", error);
        
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = asyncHandler
