const Users = require("../models/user.model");
const { newUser } = require("../services/user.service");
const Apierror = require("../utils/Apierror");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  sendAccountVerificationLink,
  generateHashToken,
  sendResetPasswordLink,
} = require("./auth.controller");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  if (!email)
    throw new Apierror(400, "Something weng wrong while registering user");

  const emailExist = await Users.findOne({ email });

  if (emailExist) throw new Apierror(400, "Email already exist");

  await newUser({ email, password, userName });
  return sendAccountVerificationLink(req, res);
});

// ##########################################################------This is for the send of the link for the verification of email---------------------------------#############################

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { code } = req.body;
  const hashToken = generateHashToken(token);
  const tokenIsValid = await Users.findOne({
    accountVerificationToken: hashToken,
    emailTokenExpires: { $gte: Date.now() },
    otp: code,
  });
  if (!tokenIsValid)
    throw new Apierror(401, "Token is expired or didn't matched");
  const emailVerified = await Users.findOneAndUpdate(
    { _id: tokenIsValid._id },
    { isEmailVerified: true },
    { new: true }
  );
  await tokenIsValid.save({ validateBeforeSave: false });
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        emailVerified,
        " Email verification Token sent successfully"
      )
    );
});

// ##########################################################------This is for the resend of the link for the verification of email---------------------------------#############################
const resendVerifyLink = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const findUser = await Users.findOne({ email });

  if (!findUser) throw new Apierror(404, "User doesnt exist");
  return sendAccountVerificationLink(req, res);
});

// ##########################################################------This is for the send of the link for the reset password of password---------------------------------#############################
const resetPasswordLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await Users.findOne({ email });
  if (!findUser) throw new Apierror(404, "User doesnt exist");
  if (findUser.isEmailVerified !== true) {
    throw new Apierror(404, "User is not verified");
  }
  return sendResetPasswordLink(req, res);
});

// ##########################################################------Generate Access And Refresh Token Method ---------------------------------#############################

const generateAccessAndRefreshToken = async (user) => {
  const isUser = await Users.findById(user);
  if (!isUser) throw new Apierror(401, "User not found");
  const accessToken = isUser.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  return { accessToken, refreshToken };
};

// ##########################################################------This is the login and password method ---------------------------------#############################

const loginMethod = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) throw new Apierror(401, "User doesn't exist");
  if (!user.isEmailVerified) {
    sendAccountVerificationLink(req, res); 
    return
  }  const isPasswordCorrect = user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new Apierror(400, "Password wrong");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedIn = await Users.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie(accessToken)
    .cookie(refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

module.exports = {
  registerUser,
  verifyEmail,
  resendVerifyLink,
  resetPasswordLink,
  loginMethod
};
