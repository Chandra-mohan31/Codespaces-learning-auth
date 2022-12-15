require('dotenv').config()
require("./database/database").connect()

const User = require("./model/user");
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("<h1>hey there</h1>");
})

app.post("/register",async (req,res)=>{
    try {
        // get all data from body
        const  {firstname,lastname,email,password} =  req.body;
        //all the data should exists 
        
        if(!(firstname && lastname && email && password)){
            res.status(400).send('All fields are compulsory');
        }

        //check if user already exists based on the email 
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).send('A user with the email already exists')
        }
        //encrypt the password 
        
        const encryPassword = await bcrypt.hash(password,10);
        
        //save the use in db
        
        const newUser = await User.create({
            firstname: firstname,
            lastname,
            email,
            password: encryPassword
        })
        

        // generate a token and send it
        const token = jwt.sign(
            {id: newUser._id,email: email},
            'shhhh', //process.env.jwtsecret
            {
                expiresIn: "2h"
            }
        );
        newUser.token = token;
        newUser.password = undefined;
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
    }
})

app.post("/login",async (req,res)=>{
    try{
       //get all data from the frontend
       const {email,password} = req.body;
       //validation

       if( !(email && password) ){
        res.status(400).send("fields are missing");

       }
       //find the user in db
       const user = await User.findOne({email});
       if(!user){
        res.status(400).send('A user with the email doesnt exists')
    }
       //match the password 
       if(user && (await bcrypt.compare(password,user.password)) ){
        const token = jwt.sign({
            id: user._id
        },
        'shhhh', //process.env.jwtsecret
        {
            expiresIn: "2h"
        }
        )    
        user.token = token;
        user.password = undefined;
        //send token in user cookie
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true       
        }

        //send the token as response 
        res.status(200).cookie("token",token,options).json({
            success: true,
            token,
            user
        })
       }
    
       


    }catch(err){
        console.log(err);
    }
})

module.exports = app;