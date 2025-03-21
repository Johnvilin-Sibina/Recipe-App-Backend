import mongoose from "mongoose";


const recipeSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            required:true,
            trim:true
        },
        cookingTime:{
            type:Number,
            required:true,
            trim:true
        },
        ingredients:{
            type:Array,
            required:true
        },
        instructions:{
            type:Array,
            required:true,
        },
        image:{
            type:String,
            required:true
        }
    },
    { timestamps: true }
)

const Recipe = mongoose.model('Recipe',recipeSchema);
export default Recipe;