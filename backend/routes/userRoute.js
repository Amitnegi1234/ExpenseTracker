const express=require('express')
const userController=require('../controllers/userController')
const router=express.Router()
const authentication=require('../middleware/auth')

router.post('/add',userController.addUser)
router.get('/get',userController.getUser)
router.post('/login',userController.loginUser)

router.get('/me',authentication.authentication,userController.getCurrentUser)

module.exports=router;