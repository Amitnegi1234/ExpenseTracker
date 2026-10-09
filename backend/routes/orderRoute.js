const express=require('express')
const orderController=require('../controllers/orderController')
const authenticationUser=require('../middleware/auth')
const router=express.Router();

router.post('/create',authenticationUser.authentication,orderController.createOrder)
router.post('/verify', authenticationUser.authentication, orderController.verifyPayment)

module.exports=router;
