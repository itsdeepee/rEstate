import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken'

/**
 * Middleware function to verify the authenticity of the JWT token attached to the request.
 * @param {object} req - The request object containing the JWT token in cookies.
 * @param {object} res - The response object to send back any errors if authentication fails.
 * @param {function} next - The next middleware function in the stack.
 */
export const verifyToken=(req,res,next)=>{
    // Retrieve the JWT token from cookies
    const token =req.cookies.access_token;

     // If token is missing, return a 401 Unauthorized error
    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }

     // Verify the JWT token with the provided secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err) return next(errorHandler(403,'Forbidden'));

        // Attach user object from token to the request for further processing
        req.user=user;
        next();
    });

}