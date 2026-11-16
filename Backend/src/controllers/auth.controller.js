const userModel = require('../models/user.models');
const accountModel = require('../models/accounts.models');
const jwt = require('jsonwebtoken');
require("dotenv").config();

async function userRegisterController(req,res){
    const {email,password,name} = req.body
    const isExists =  await userModel.findOne({
        email:email
    })
    if(isExists){
        return res.status(422).json({
            message:"User already exists with email",
            status:"failed"
        });
    }
    const user = await userModel.create({
        email,  
        password,
        name,
    });
    
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn: "3d"})
    // try{await emailService.sendRegistrationEmail(user.email,user.name);}catch(emailError){console.log("Error has been occured!!");}
    res.cookie("token",token)
    res.status(201).json({
        user:{
            _id:user.id,
            email:user.email,
            name:user.name
        },
    });
}

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'No User Found Please Register First'
            });
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Password Didn't Match!"
            });
        }
        const isAccount = await accountModel.findOne({_id:user._id});
        var accountvalue = 0;
        if(isAccount){accountvalue = 1;}

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            message: 'Logged in successfully',
            user: {
                _id: user._id, 
                email: user.email,
                name: user.name,
                accountvalue:accountvalue
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error logging in'
        });
    }
}

module.exports = {
    userRegisterController,
    userLogin
}