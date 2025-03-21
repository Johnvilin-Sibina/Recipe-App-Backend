import {errorHandler} from "../Utils/Error.js";
import Recipe from "../Models/recipeModel.js";


export const addRecipe = async (req, res, next) => {
    try {
        const { title, description, cookingTime, ingredients, instructions, user, image } = req.body;

        // Validate required fields
        if (!title || !description || !cookingTime || !ingredients || !instructions || !image|| !user) {
            return next(errorHandler(400, "All fields are required"));
        }

        // Create a new recipe
        const newRecipe = new Recipe({
            user,
            title,
            description,
            cookingTime,
            ingredients,
            instructions,
            image 
        });

        // Save to the database
        await newRecipe.save();

        res.status(200).json({message: "Recipe added successfully", recipe: newRecipe });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};
