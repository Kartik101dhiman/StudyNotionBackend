const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const { email } = req.body;
    //check user for this email, email validation
    const user = User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }
    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and tme

    const updatedDetail = await User.findOneAndUpdate(
      { email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    //Url

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link",
      `Password reset linl ${url}`
    );
    return res.json({
      sucess: false,
      messsage:
        "Email send successfully!,Please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset password",
    });
  }
};

// reset Password

exports.resetPassword = async (req, res) => {
  try {
    //get email and token
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }
    //get user from db using token
    const userDetail = await User.findOne({ email });
    // no entry invalid token
    if (userDetail) {
      return res.json({
        success: false,
        message: "Token in invalid",
      });
    }
    //token time check
    if (userDetail.resetPasswordExpires > Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, please regenerate your password",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
        success:true,
        message:"Password reset successfully"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset password",
    });
  }
};
