import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//signup a new user
export const Signup = async (req, res)=>{
    const {fullname, email, password, bio}=req.body;
    try{
        if(!fullname || !email || !password || !bio){
            return res.json({success: false, message: 'Missing Details'})
        }
        const user=await User.findOne({email});
        if (user){
            return res.json({success:false, message:'Account already exists'})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({
            fullname, email, password:hashedPassword, bio
        });

        const token= generateToken(newUser._id)
        
        res.json({success: true, userData: newUser, token, message:'Account created successfully'})
    } catch(error){
        console.log(error.message)
        res.json({success: false, userData: newUser, token, message: error.message})
    }
}

//controller to login a user
export const login =async (req, res)=>{
    try{
        const {email, password}=req.body;
        const userData = await User.findOne({email})
        const isPasswordCorrect=await bcrypt.compare(password,userData.password);
        if (!isPasswordCorrect){
            return res.json({ success:false, message:'Invalid credentials'});
        }
        const token=generateToken(userData._id);
        res.json({success: true, userData, token, message:'Login successful'})
    }catch(error){
        console.log(error.message);
        res.json({success: false, userData: newUser, token, message: error.message});
    }
}

//controller to check if user is authenticated
export const checkAuth=(req, res)=>{
    res.json({success:true, user: req.user});  //will return the user data only when the user is authenticated
}

//controller to update user porfile details
export const updateprofile= async (req, res)=>{
    try{
        const {profilePic, bio, fullname}=req.body;
        const userId=req.user._id;
        let updatedUser;
        //updated user data as follow;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId, {bio, fullname}, {new:true})
        }else{
            //to upload the profile pic in cloudinary
            const upload= await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic: upload.secure_url, bio, fullname}, {new:true});
        }
        res.json({successs:true, user:updatedUser})
    }catch(error){
        console.log(error.message);
        res.json({successs:false, message:error.message})
    }
}