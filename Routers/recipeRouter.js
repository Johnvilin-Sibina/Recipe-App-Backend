import { addRecipe, getRecipeById, getRecipes } from "../Controllers/recipeController.js"
import express from 'express'
import {verifyToken} from '../Middleware/verifyToken.js'


const router = express.Router()

router.post('/add-recipe',verifyToken,addRecipe)
router.get('/get-recipies',getRecipes)
router.get('/get-recipe/:id',verifyToken,getRecipeById)


export default router