import express from 'express'
import { verifyToken } from '../Middleware/verifyToken.js'
import { getSharedRecipies, updateUser } from '../Controllers/userController.js'

const router = express.Router()

router.get('/shared-recipes/:id',verifyToken,getSharedRecipies)
router.put('/update-user/:id',verifyToken,updateUser)

export default router