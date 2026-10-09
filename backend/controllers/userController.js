const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const addUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const hashPassword = await bcrypt.hash(password,10)
        const user=await User.create({
            name:name,
            email:email,
            password:hashPassword
        })
        return res.status(201).json({
            message: 'User added successfully',
            user: user
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}

const getUser=async(req,res)=>{
    try {
        const user=await User.findAll();
        if (user.length === 0) {
            return res.status(404).send('No users exist');
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}

const generateAccesstoken=(id)=>{
    return jwt.sign({userId : id}, process.env.JWT_SECRET)
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await User.findOne({
            where:{
                email:email
            }
        }) 
        if(!user){
            return res.status(404).json({
                message:'email not found'
            })
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword){
            return res.status(401).json({ message: 'Invalid password' });
        }
        return res.status(200).json({
            message:'login successfully',
            user:user,
            token:generateAccesstoken(user.id)
        })
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'isPremium']
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

module.exports={
    addUser, getUser, loginUser, getCurrentUser
}