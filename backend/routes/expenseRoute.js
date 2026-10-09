const express = require('express');
const expenseController = require('../controllers/expenseController')
const userAuthentication = require('../middleware/auth')
const router=express.Router()


router.post('/add', userAuthentication.authentication,expenseController.addExpense)
router.get('/get', userAuthentication.authentication, expenseController.getExpense)
router.delete('/delete/:id',userAuthentication.authentication, expenseController.deleteExpense)
router.get('/leaderboard',userAuthentication.authentication,expenseController.getLeaderboard)

module.exports=router;