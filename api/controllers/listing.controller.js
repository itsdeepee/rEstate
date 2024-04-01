import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


// Controller function to create a new listing
export const createListing = async (req, res, next) => {
    try {
        // Creating a new listing based on request body
        const listing = await Listing.create(req.body);
        // Returning a successful response with the created listing
        return res.status(201).json(listing);
    } catch (error) {
        // Passing any caught errors to the error handling middleware
        next(error);
    }
}

// Controller function to delete a listing
export const deleteListing = async (req, res, next) => {
    try {
        // Finding the listing by ID
        const listing = await Listing.findById(req.params.id);
        // Handling case where the listing does not exist
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        // Checking if the requesting user is authorized to delete the listing
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only delete your own listings!'));
        }

        // Deleting the listing
        await Listing.findByIdAndDelete(req.params.id);
        // Returning a success message upon deletion
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        // Passing any caught errors to the error handling middleware
        next(error);
    }
}

// Controller function to update a listing
export const updateListing = async (req, res, next) => {
    try {
        // Finding the listing by ID
        const listing = await Listing.findById(req.params.id);
        // Handling case where the listing does not exist
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        // Checking if the requesting user is authorized to update the listing
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only update your own listing!'));
        }

        // Updating the listing with the new data
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated listing
        );
        // Returning the updated listing
        res.status(200).json(updatedListing);
    } catch (error) {
        // Passing any caught errors to the error handling middleware
        next(error);
    }
}

export const getListing=async(req,res,next)=>{
    try{
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            console.log('hello');
            return next(errorHandler(404,'Listing not found!'));
        }
        console.log(listing)
        res.status(200).json(listing);
    }catch(error){
        next(error)
    }
}