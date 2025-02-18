const User = require("../models/User");
const mailSender = require("../utils/mailSender");

exports.resetPasswordToken = async (req, res) => {
    try{
        const {email}=req.body;
        const user= User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your email is not registered with us"
            })
        }

        const token= crypto.randomUUID()
        //get email from req body
        //check user for this email, email validation
        //generate token
        //update user by adding token and tme
        //Url

        const url=`http://localhost:3000/update-password/${token}`
    }
    catch(error){

    }
};
