import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './Database/config.js'
import authRoute from './Routers/authRouter.js'
import recipeRoute from './Routers/recipeRouter.js'
import userRoute from './Routers/userRouter.js'

dotenv.config()

const app = express()

app.use(
    cors({
        origin:"*",
        credentials:true
    })
)

app.use(express.json())

connectDB()

app.get('/',(req,res)=>{
    res.send('Welcome to TastyTrove API endpoints.')
})

//API routers
app.use('/api/auth',authRoute)
app.use('/api/recipe',recipeRoute)
app.use('/api/user',userRoute)


//ErrorHandler - middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server errror"

    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})