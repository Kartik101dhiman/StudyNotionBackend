const Profile=require("../models/Profile");
const User= require("../models/User");

exports.updateProfile= (req,res)=>{
    try{

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Unable to update user profile",
            error:error.message
        })
    }
}