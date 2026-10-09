const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
require('dotenv').config({ quiet: true })

const authentication = (req,res,next)=>{
    try {
        const token = req.header("authorization");
        // console.log("TOKEN RECEIVED:", token);
        // console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);
        const user = jwt.verify(token, process.env.JWT_SECRET)
        // console.log('user id is ',user.userId);
        User.findByPk(user.userId).then(user=>{
            req.user=user;
            next();
        })
    } catch (error) {
        console.log('jwt error',error.message);
        return res.status(401).json({success:false})
    }
}

module.exports={
    authentication
}