const jwt= require("jsonwebtoken");
require("dotenv").config();
const User=require("..models/User");

//auth

exports.auth= async (req,res,next)=>{
    try{
        const token= req.cookies.token||req.body.token||req.header("Authorisation").replace("Bearer ","")
    }
    catch(error){

    }
}