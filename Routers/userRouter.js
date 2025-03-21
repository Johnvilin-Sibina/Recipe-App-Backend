import express from 'express'
import { verifyToken } from '../Middleware/verifyToken.js'
import { getSharedRecipies } from '../Controllers/userController.js'

const router = express.Router()

router.get('/shared-recipes/:id',verifyToken,getSharedRecipies)

export default router