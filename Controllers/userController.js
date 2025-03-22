import Recipe from "../Models/recipeModel.js";
import User from "../Models/userModel.js";
import mongoose from "mongoose";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from "bcryptjs";

export const getSharedRecipies = async(req,res,next)=>{
    const {id} = req.params
    try {
        const sharedRecipes = await Recipe.find({user:id})

        res.status(200).json({message:"User Fetched Successfully",sharedRecipes})

    } catch (error) {
        console.log(error.message)
        return next(errorHandler(500,error.message))
    }
}

export const updateUser = async (req, res, next) => {
    const {id} = req.params
    const { userName, email, password, profilePicture } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log('User Not Found')
            return next(errorHandler(404, "User not found"));
        }

        // Ensure the logged-in user is updating their own profile
        if (req.user.id !== id) {
            console.log("Unauthorized to update the profile")
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


        // Remove password field from the response
        const { password:hashedPassword, ...rest } = updatedUser._doc;

        res.status(200).json({
            message: "User updated successfully",
            rest,
        });
        console.log(rest)

    } catch (error) {
        console.log(error.message);
        return next(errorHandler(500, error.message));
    }
};

// export const updateUser = async (req, res, next) => {
//     const { id } = req.params;
//     const { userName, email, password } = req.body;

//     try {
//         // Validate ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return next(errorHandler(400, "Invalid User ID"));
//         }

//         // Find user by ID
//         const user = await User.findById(id);
//         if (!user) {
//             return next(errorHandler(404, "User not found"));
//         }

//         // Ensure the logged-in user is updating their own profile
//         if (req.user.id.toString() !== id) {
//             return next(errorHandler(401, "Unauthorized to update the profile"));
//         }

//         // Create an object to hold updated fields
//         let updatedFields = { userName, email };

//         // If password is provided, hash it before updating
//         if (password) {
//             const hashedPassword = bcryptjs.hashSync(password, 10);
//             updatedFields.password = hashedPassword;
//         }

//         // Update user details
//         const updatedUser = await User.findByIdAndUpdate(
//             id,
//             { $set: updatedFields },
//             { new: true, runValidators: true }
//         );

//         // Check if update was successful
//         if (!updatedUser) {
//             return next(errorHandler(404, "User update failed"));
//         }

//         // Remove password from response
//         const { password: _, ...rest } = updatedUser._doc;

//         res.status(200).json({
//             message: "User updated successfully",
//             user: rest,
//         });

//     } catch (error) {
//         console.log(error.message);
//         return next(errorHandler(500, "Something went wrong"));
//     }
// };