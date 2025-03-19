import express from "express";
import { forgotPassword, google, loginUser, registerUser, resetPassword } from "../Controllers/authController.js";



const router = express.Router();

router.post('/register-user',registerUser)
router.post('/login-user',loginUser)
router.post('/forgot-password',forgotPassword)
router.put('/reset-password/:id/:token',resetPassword)
router.post('/google',google)

export default router;