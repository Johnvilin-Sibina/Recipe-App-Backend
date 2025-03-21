import { addRecipe } from "../Controllers/recipeController.js"
import express from 'express'
import {verifyToken} from '../Middleware/verifyToken.js'


const router = express.Router()

router.post('/add-recipe',verifyToken,addRecipe)


export default router