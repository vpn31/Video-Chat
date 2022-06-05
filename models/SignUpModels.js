const mongoose=require('mongoose');

const signUpTemplate=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        min: 1,
        max: 255,
    },
    lastname:{
        type:String,
        required:false,
        min: 0,
        max: 255,
    },
    email:{
        type:String,
        required:true,
        min: 6,
        max: 255,
    },
    password:{
        type:String,
        required:false,
        min: 6,
        max: 1024,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

module.exports=mongoose.model('myTable',signUpTemplate)