const express=require('express')
const userController=require('../controllers/userController')
const router=express.Router()

router.post('/add',userController.addUser)
router.get('/get',userController.getUser)
router.post('/login',userController.loginUser)

module.exports=router;