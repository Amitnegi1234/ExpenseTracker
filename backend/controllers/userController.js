const User=require('../models/userModel')

const addUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const user=await User.create({
            name:name,
            email:email,
            password:password
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
        if(user.password!==password){
            return res.status(401).json({ message: 'Invalid password' });
        }
        return res.status(200).json({
            message:'login successfully',
            user:user
        })
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports={
    addUser, getUser, loginUser
}