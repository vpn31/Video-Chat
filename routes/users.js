const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
const {forwardAuthenticated}=require('../config/auth');

//User Model
const User=require('../models/SignUpModels');

//Login
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login')
});

//Register
router.get('/signUp',(req,res)=>{
    res.render('register')
});

//Register Handle
router.post('/signUp',(req,res)=>{
    const {firstname,lastname,email,password,password2}=req.body;
    let errors=[];

    //All fields are compulsory
    if(!firstname || !email || !password || !password2){
    errors.push({msg:"Please fill all the fields"})
    }

    //Passwords match
    else if(password!==password2){
        errors.push({msg:"Passwords do not match"})
    }

    //Password length
    else if(password.length<6){
        errors.push({msg:"Password should be atleast 6 characters"})
    };

    if(errors.length>0){
        res.render('register',{
            errors,
            firstname,
            lastname,
            email,
            password,
            password2
        });
        console.log(errors);
    }
    else{
        //Validation
        User.findOne({email:email})
        .then(user=>{
            if(user){
                //User exists
                errors.push({msg:"User is already registered"});
                res.render('register',{
                    errors,
                    firstname,
                    lastname,
                    email,
                    password,
                    password2
                })
            }
            else{
                const newUser=new User({
                    firstname,
                    lastname,
                    email,
                    password
                })
                errors=null;
                //Hash Password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err)
                        throw err;
                        //Set password to hash
                        newUser.password=hash;
                        //Save
                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','Registration Successful')
                            res.redirect('/users/login');
                        })
                        .catch(err=>console.log(err));
                    })
                })
            }
        })
    }
})

//Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//Logout Handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

module.exports=router;