const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
   
  },
  avatar: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  accountVerificationToken:{
    type:String,
  },
  emailTokenExpires: {
    type: Number,
  },
  resetPasswordVerificationToken:{
    type:String,
  },
  resetPasswordTokenExpires: {
    type: Number,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getEmailVerificationCode = function(){
  const code = Math.floor(Math.random()*900000)+100000
  this.otp = code
  console.log("code", code);
  
  return code 
}

userSchema.methods.getEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("this.accountVerificationToken", this.accountVerificationToken);
  this.emailTokenExpires = Date.now() + 2 * 60 * 1000;
  return token;
};

userSchema.methods.resetPasswordToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordTokenExpires = Date.now() + 2 * 60 * 1000;
  return token;
};


const User = mongoose.model("User", userSchema);
module.exports = User;
