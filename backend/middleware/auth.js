const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
require('dotenv').config()

const authentication = (req,res,next)=>{
    try {
        const token = req.header("authorization");
        console.log("token is ", token);
        const user = jwt.verify(token, process.env.JWT_SECRET)
        // console.log('user id is ',user.userId);
        User.findByPk(user.userId).then(user=>{
            req.user=user;
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false})
    }
}

module.exports={
    authentication
}