import Recipe from "../Models/recipeModel.js";
import { errorHandler } from "../Utils/Error.js";

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