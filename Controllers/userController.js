import Recipe from "../Models/recipeModel.js";
import User from "../Models/userModel.js";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from "bcryptjs";


// Function to get all recipes shared by a user
export const getSharedRecipies = async(req,res,next)=>{
    const {id} = req.params
    try {
        const sharedRecipes = await Recipe.find({user:id})

        res.status(200).json({message:"User Fetched Successfully",sharedRecipes})

    } catch (error) {
        return next(errorHandler(500,error.message))
    }
}


// Function to update user details
export const updateUser = async (req, res, next) => {
    const {id} = req.params
    const { userName, email, password, profilePicture } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Ensure the logged-in user is updating their own profile
        if (req.user.id !== id) {
            return next(errorHandler(401, "Unauthorized to update the profile"));
        }

        // Create an object to hold the updated fields
        let updatedFields = { userName, email, profilePicture };

        // If the password is provided, hash it before updating
        if (password) {
            const hashedPassword = bcryptjs.hashSync(password, 10);
            updatedFields.password = hashedPassword;
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );


       // Remove password before sending response
        const { password:hashedPassword, ...rest } = updatedUser._doc;

        res.status(200).json({
            message: "User updated successfully",
            rest,
        });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


// Function to delete user account
export const deleteUser = async(req,res,next)=>{
    try {
        const {id} = req.params

        const deletedUser = await User.findOneAndDelete({_id:id})
        if (!deletedUser) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json({message:"User account deleted successfully"})
    } catch (error) {
       return next(errorHandler(500,error.message)) 
    }
}