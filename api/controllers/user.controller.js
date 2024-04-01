import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test=(req,res)=>{
    res.json({
        message:"API Test endpoint"
    });
    res.status(200);
}

/**
 * Update a user's information based on the provided user ID.
 * @param {object} req - The request object containing user ID in parameters and updated user information in body.
 * @param {object} res - The response object to send back a success message along with the updated user information.
 * @param {function} next - The next middleware function in the stack.
 */
export const updateUser=async(req,res,next)=>{   
    // Check if the authenticated user matches the user ID in the request parameters
    if(req.user.id!==req.params.id) return next(errorHandler(401,'Not authorized to update account'))

    try{
         // If password is included in the request body, hash it
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10);
        }

        // Update user information in the database
        const updatedUser=await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                photo:req.body.photo,
            }
        },{new:true})

        // Omit password field from updated user information
        const {password, ...rest}=updatedUser._doc

        // Send a 200 OK status with a success message and updated user information in JSON response
        res.status(200).json({
            success:true,
            message:"User updated successfully!",
            user:rest
        })

    }catch(error){
         // Pass any caught errors to the next middleware
        next(error)
    }
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.id) {
        return next(errorHandler(401,"You can only delete your own account!"))
    }

    try{
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token');
        res.status(200).json({message:'User deleted'});
    }catch(error){
        next(error);
    }
}

export const getUserListings=async(req,res,next)=>{
    if(req.user.id==req.params.id){
        try{
            const listings=await Listing.find({userRef:req.params.id});
            res.status(200).json(listings);
        }catch(error){
            next(error)
        }
    }else{
        return next(errorHandler(401,'You can only view your own listings!'));
    }
}