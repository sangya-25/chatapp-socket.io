import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Test Cloudinary connection
export const testCloudinary = async (req, res) => {
    try {
        // Try to get Cloudinary account info
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection test result:', result);
        
        res.json({
            success: true,
            message: 'Cloudinary connection successful',
            details: result
        });
    } catch (error) {
        console.error('Cloudinary connection test failed:', error);
        res.status(500).json({
            success: false,
            message: 'Cloudinary connection failed',
            error: error.message
        });
    }
}

//signup a new user
export const Signup = async (req, res)=>{
    const {fullname, email, password, bio}=req.body;
    try{
        // Validate required fields
        if(!fullname || !email || !password || !bio){
            return res.status(400).json({
                success: false, 
                message: 'Please provide all required fields: fullname, email, password, and bio'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({
                success: false, 
                message: 'An account with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            bio
        });

        // Generate token
        const token = generateToken(newUser._id);
        
        // Return success response
        res.status(201).json({
            success: true,
            userData: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            },
            token,
            message: 'Account created successfully'
        });
    } catch(error){
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during signup. Please try again.'
        });
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

//controller to update user profile details
export const updateprofile = async (req, res) => {
    try {
        const { profilePic, bio, fullname } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!fullname && !bio && !profilePic) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one field to update'
            });
        }

        let updatedUser;
        const updateData = {};

        // Add fields to update if they exist
        if (fullname) updateData.fullname = fullname;
        if (bio) updateData.bio = bio;

        if (profilePic) {
            try {
                // Upload to Cloudinary
                const upload = await cloudinary.uploader.upload(profilePic, {
                    folder: 'profile_pics',
                    resource_type: 'auto'
                });

                // Delete old profile picture if it exists
                const currentUser = await User.findById(userId);
                if (currentUser.profilePic) {
                    const publicId = currentUser.profilePic.split('/').slice(-1)[0].split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }

                updateData.profilePic = upload.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload profile picture. Please try again.'
                });
            }
        }

        // Update user in database
        updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePic: updatedUser.profilePic
            },
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating profile. Please try again.'
        });
    }
}