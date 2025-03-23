import express from 'express'
import { verifyToken } from '../Middleware/verifyToken.js'
import { deleteUser, getSharedRecipies, updateUser } from '../Controllers/userController.js'

const router = express.Router()

router.get('/shared-recipes/:id',verifyToken,getSharedRecipies)
router.put('/update-user/:id',verifyToken,updateUser)
router.delete('/delete-user/:id',verifyToken,deleteUser)

export default router