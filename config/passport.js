const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID='972985974083-sps9h0vnp4k6tatdulipobh9dgc0b418.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='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';

//Load User Model
const User=require('../models/SignUpModels');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //User match
            User.findOne({email:email})
            .then(user =>{
                if(!user){
                    return done(null,false,{message:'User is not registered'});
                }
                //Password match
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err)
                    throw err;

                    if(isMatch){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message:'Incorrect Password'});
                    }
                })
            })
            .catch(err=>console.log(err));
        })
    );

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://vchat-vp.herokuapp.com/users/google/callback",
        passReqToCallback: true
        },
        function(req,accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOne({googleId:profile.id}).then((currentUser)=>{
                if(currentUser){
                    console.log('User is: ',currentUser);
                    done(null,currentUser);
                }
                else{
                    new User({ 
                        googleId : profile.id,
                        firstname : profile.name.givenName,
                        lastname : profile.name.familyName,
                        email : profile.emails[0].value
                     }).save().then((newUser)=>{
                         console.log('New User created: '+newUser);
                         done(null,newUser);
                     })
                }
            })
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}