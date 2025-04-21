const bcrypt=require('bcryptjs');
const User = require('../models/user');
const jwt=require('jsonwebtoken');
const signUp=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password) return res.status(401).json({status:'fail',message:'Something is missing.'});

        const hashPassword=await bcrypt.hash(password,10);
        await User.create({name,email,password:hashPassword});
        res.status(201).json({status:'success',message:'You are registered successfully'});
    }catch(error){
        console.log("signUp :",error);
        res.status(500).json({status:'error',message:"Can't register. Try again"});
    }
}


const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({status:'fail',message:"Invalid email or password"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(401).json({status:'fail',message:"Invalid email or password"});

        const token=jwt.sign({userId:user._id},'my_secret_key',{expiresIn:'5d'});

        const userData=await User.findById(user._id).select('-password');
        res.status(200).json({status:'success',message:'You are loggedIn successfully',user:userData,token});
    }catch(error){
        console.log("login :",error);
        res.status(500).json({status:'error',message:"Failed. Try again"});
    }
}

const getUserData=async(req,res)=>{
    try {
        res.status(200).json({status:'success',user:req.user});
    } catch (error) {
        console.log("getUserData :",error);
        res.status(500).json({status:'error',message:"Failed to get user data."}); 
    }
}

module.exports={
    signUp,
    login,
    getUserData
}