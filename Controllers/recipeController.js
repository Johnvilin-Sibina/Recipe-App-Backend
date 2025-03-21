import {errorHandler} from "../Utils/Error.js";
import Recipe from "../Models/recipeModel.js";


export const addRecipe = async (req, res, next) => {
    try {
        const { title, description, cookingTime, ingredients, instructions, user, image } = req.body;

        // Validate required fields
        if (!title || !description || !cookingTime || !ingredients || !instructions || !image|| !user) {
            return next(errorHandler(400, "All fields are required"));
        }

        const newRecipe = new Recipe({
            user,
            title,
            description,
            cookingTime,
            ingredients,
            instructions,
            image 
        });

        await newRecipe.save();

        res.status(200).json({message: "Recipe added successfully", recipe: newRecipe });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find(); 

        if (!recipes || recipes.length === 0) {
            return next(errorHandler(404, "No recipes found"));
        }

        res.status(200).json({message:"Recipes fetched successfully", recipes });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const getRecipeById = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const recipe = await Recipe.findById(id); 

        if (!recipe) {
            return next(errorHandler(404, "Recipe not found"));
        }

        res.status(200).json({ message:"Recipe Fetched Successfully", recipe });
    } catch (error) {
        console.log(error.message);
        return next(errorHandler(500, error.message));
    }
};


