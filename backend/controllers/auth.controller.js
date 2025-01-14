const Users = require("../models/user.model");
const Origin = require("../Origin");
const { transferMail } = require("../services/email.service");
const Apierror = require("../utils/Apierror");
const ApiResponse = require("../utils/ApiResponse");
const crypto = require("crypto");

const generateHashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ##########################################################------accountVerificationLink---------------------------------#############################
const sendAccountVerificationLink = async (req, res, next) => {
  const email = req.body.email;
  const findUser = await Users.findOne({ email }).exec();
  console.log("code");
  if (!findUser) throw new Apierror(401, "User not found with this user");
  const emailVerificationCode = findUser.getEmailVerificationCode();
  const emailVerificationToken = findUser.getEmailVerificationToken();
  await findUser.save({ validateBeforeSave: false });
  console.log("emailVerificationToken", emailVerificationToken);
  try {
    const url = `${Origin}/email-verify/${emailVerificationToken}`;
    await transferMail({
      email: findUser.email,
      subject: "Verify your email",
      title: "Thank you for signing up!",
      body: `
        <h3>Welcome to Lama Estate!</h3>
        <p>To get started, please confirm your email address below.
        Your email verification code is <span style="font-size: 18px;font-weight: 600;">${emailVerificationCode}</span>.
        The link will expire after <span style="font-weight: 600;">2 hours</span>.
        Once this is done, you can go ahead and verify your identity directly in the application, and finally get to the fun stuff.</p>
      `,
      buttonText: "Confirm your email",
      buttonLink: url,
    });
  } catch (error) {
    findUser.getEmailVerificationToken = undefined;
    await findUser.save({ validateBeforeSave: false });
    throw new Apierror(500, "Something went wrong please try again later");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        emailVerificationToken,
        "Email verification token sent successfully"
      )
    );
};


// ##########################################################------sendResetPasswordLink---------------------------------#############################
const sendResetPasswordLink = async (req, res, next) => {
  const email = req.body.email;
  const findUser = await Users.findOne({ email }).exec();
  console.log("code");
  if (!findUser) throw new Apierror(401, "User not found with this user");
  const emailVerificationToken = findUser.resetPasswordToken();
  await findUser.save({ validateBeforeSave: false });
  console.log("emailVerificationToken", emailVerificationToken);
  try {
    const url = `${Origin}/email-verify/${emailVerificationToken}`;
    await transferMail({
      email: findUser.email,
      subject: "Reset Password",
      title: "Reset Password",
      body: `
        <h3>Reset Password</h3>
        <p>We have received a request to reset the password associated for the account associated with ${findUser.email}.
        If you did not request a new password, please ignore this email.
        You can reset your password by clicking the link below. The link will expire after <span style="font-weight: 600;">2 hours</span>.</p>
      `,
      buttonText: "Reset your password",
      buttonLink: url,
    });
  } catch (error) {
    findUser.getEmailVerificationToken = undefined;
    await findUser.save({ validateBeforeSave: false });
    throw new Apierror(500, "Something went wrong please try again later");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        emailVerificationToken,
        "Reset password token sent successfully"
      )
    );
};

module.exports = {
  sendAccountVerificationLink,
  generateHashToken,
  sendResetPasswordLink,
  sendResetPasswordLink
};
