const Users = require("../models/user.model")


const newUser = async(email)=>{
    console.log("email", email);
    console.log("type of",typeof email);
    
    const user = await Users.create(email)
    
    return {email: user.email}
}

module.exports = {newUser}