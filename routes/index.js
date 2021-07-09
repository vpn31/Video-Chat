const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
const { v4: uuidv4 } = require("uuid");


//Welcome Page
router.get('/',(req,res)=>{
    res.render('welcome')
});

//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        firstname:req.user.firstname
    });
});

//Redirect to id
router.get('/video',ensureAuthenticated,(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});

//Room
router.get('/:room',ensureAuthenticated, (req, res) => {
    res.render('room', { 
        roomId: req.params.room,
        firstname:req.user.firstname,
        lastname:req.user.lastname
     });
});


module.exports=router;