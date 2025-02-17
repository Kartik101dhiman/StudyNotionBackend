const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile= require("../models/Profile");

//sendOTP

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: "User already registered",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    var result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//SignUP

exports.signUp= async (req,res)=>{
  try{
    //fetch data
    const {firstName,lastName,email,password,confirmPassword,otp}=req.body;
 //validate data
    if(!firstName||!lastName||!email||!password||!confirmPassword||!accountType||!otp){
      return res.status(403).json({
        success:false,
        message:"All field are required"
      })
    }
   
    //2 password match
    if(password!==confirmPassword){
      return res.status(400).json({
        success:false,
        message:"Password and confirm password value does not match, please try again"
      })
    }
    // check User exist or not

    const existingUser= await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User is already registered"
      })
    }
    // find more recent OTP

    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    if(recentOtp.length==0){
      return res.status(400).json({
        success:false,
        message:"OTP not found"
      })
    }
    else if(otp!==recentOtp){
        return res.status(400).json({
          success:false,
          message:"Invalid OTPs"
        })
    }

    // Hash password
    const hashedPassword=await bcrypt.hash(password,10);

    //entry in DB
    const profileDetail= await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null
    })

    const user= await User.create({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      contactNumber,
      accountType,
      additionalDetails:profileDetail._id,
      image:
    })
  }
  catch(error){

  }
}

//Login

//OTPSend

//changePassword
