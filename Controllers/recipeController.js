import {errorHandler} from "../Utils/Error.js";
import Recipe from "../Models/recipeModel.js";


// Function to add a new recipe
export const addRecipe = async (req, res, next) => {
    try {
        const { title, description, cookingTime, ingredients, instructions, user, image } = req.body;

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


// Function to fetch all recipes
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


// Function to get a specific recipe by ID
export const getRecipeById = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const recipe = await Recipe.findById(id); 

        if (!recipe) {
            return next(errorHandler(404, "Recipe not found"));
        }

        res.status(200).json({ message:"Recipe Fetched Successfully", recipe });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


