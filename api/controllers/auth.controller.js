import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

/**
 * Sign up a new user by hashing the provided password, creating a new user object,
 * and saving it to the database.
 * 
 * @param {object} req - The request object containing user information such as username, email, and password.
 * @param {object} res - The response object to send back a success message upon successful user creation.
 * @param {function} next - The next middleware function in the stack.
 * @returns {object} JSON response with a success message indicating successful user creation.
 */
export const signup=async (req,res,next)=>{
    // console.log(req.url +" "+ req.method );

     // Destructure username, email, and password from the request body
    const {username, email,password}=req.body;
    // Hash the provided password
    const hashedPassword=bcryptjs.hashSync(password,10);
    // Create a new user object with hashed password
    const newUser=new User({username,email,password: hashedPassword});
    try{
        // Save the new user to the database
        await newUser.save();
         // Send a 201 Created status along with a success message in JSON response
        res.status(201).json("User created successfully");
    }catch(error){
        next(error);
    }
  

};
/**
 * Sign in a user by validating email and password, generating a JWT token upon successful authentication,
 * and sending the token along with user information in the response.
 * 
 * @param {object} req - The request object containing user email and password in the body.
 * @param {object} res - The response object to send back a token and user information.
 * @param {function} next - The next middleware function in the stack.
 * @returns {object} JSON response with user information and a JWT token upon successful sign-in.
 */
export const signin=async(req,res,next)=>{
     // Destructure email and password from the request body
    const {email,password}=req.body;
    try{
         // Find the user in the database by email
        const validUser=await User.findOne({email});
         // If user not found, return a 404 error
        if(!validUser) 
            return next(errorHandler(404,'User not found!'));

        // Compare the provided password with the hashed password stored in the database
        const validPassword=bcryptjs.compareSync(password, validUser.password);
         // If password is invalid, return a 401 unauthorized error
        if(!validPassword) return next(errorHandler(401,'Wrong credentials'));

         // Generate a JWT token with the user's id
        const token= jwt.sign({id: validUser._id},process.env.JWT_SECRET)
         // Extract user information excluding the password
        const {password: pass, ...userInfo}=validUser._doc;
         // Set the token as a cookie with httpOnly flag and expiration time
         res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
        }).status(200).json(userInfo); // Send user information in JSON response


    }catch(error){
        next(error);
    }
}

export const google=async(req,res,next)=>{
    try{
    //Check if the user exist
    const user=await User.findOne({email:req.body.email})
    if(user){
        //If the user exist authenticate the user
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        const {password:pass, ...rest}=user._doc
        res
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest);

        

    }else{
        //Create a new user
        const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
        const hashedPassword=bcryptjs.hashSync(generatedPassword, 10 );
        const newUser=new User({
            username:req.body.name.split(" ").join("").toLowerCase() +Math.random().toString(36).slice(-4) , 
            email:req.body.email,
            password:hashedPassword,
            photo:req.body.photo
        });
        await newUser.save();
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
        const {password: pass, ...rest}=newUser._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

        
    }

    }catch(error){
        next(error);
    }
}

export const signOut=async(req,res,next)=>{
    try{
        res.clearCookie('access_token')
        res.status(200).json('User has been logged out!')
    }catch(error){
        next(error);
    }
}