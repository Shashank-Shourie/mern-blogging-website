import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import User from "./Schema/User.js";

const server = express();
let PORT=3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex:true
});

const formatDatatoSend = (user)=>{
    const access_token = jwt.sign({id:user._id},process.env.SECRET_ACCESS_KEY)
    return{
        access_token,
        profile_img : user.personal_info.profile_img,
        username : user.personal_info.username,
        fullname : user.personal_info.fullname
    }
}

const generateUsername = async (email) =>{
    let username = email.split("@")[0];
    //2:29:33
    let isUsernameNotUnique = await User.exists({"personal_info.username":username}).then((result)=>result);

    isUsernameNotUnique? username+=nanoid().substring(0,5):""

    return username;
}

server.post("/signup",(req,res)=>{
    let {fullname,email,password} = req.body;
    console.log(fullname+email+password);
    //validating data
    // if(fullname.length<3){
    //     return res.status(403).json({"error":"Fullname should be atleast 3 letters long"});
    // }
    // if(!email.length){
    //     return res.status(403).json({"error":"Add email"});
    // }
    // if(!emailRegex.test(email)){
    //     return res.status(403).json({"error":"Email invalid"});
    // }
    // if(!passwordRegex.test(password)){
    //     return res.status(403).json({"error":"Password requirements not met"})
    // }
    bcrypt.hash(password,10,async (err,hashed_password)=>{
        let username = await generateUsername(email);

        let user = new User({
            personal_info: {fullname,email,password:hashed_password,username}
        })

        user.save().then((u)=>{
            return res.status(200).json(formatDatatoSend(u));
        })
        .catch(error =>{

            if(error.code ==11000){
                return res.status(400).json({"error":"Email already in use"});
            }

            return res.status(500).json({"error":error.message})
        })
        // return res.status(500).json({"error":"something went wrong"});
    })

    // return res.status(200).json({"status":"ok"})
})

server.post("/signin",(req,res)=>{
    let {email,password} = req.body;
    User.findOne({"personal_info.email":email})
    .then((user)=>{
        if(!user){
            return res.status(403).json({"error":"email not found"});
        }

        bcrypt.compare(password,user.personal_info.password,(err,result)=>{
            if(err){
                return res.status(403).json({"error":"error occured while login please try again"})
            }
            if(!result){
                return res.status(403).json({"error":"Incorrect password"});
            }
            return res.status(200).json(formatDatatoSend(user));
        });


        // console.log(user);
        // return res.json({"status":"Got user document"});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(500).json({"error":err.message})
    })
})

server.listen(PORT,()=>{
    console.log(`Listening on port -> `+PORT);
});