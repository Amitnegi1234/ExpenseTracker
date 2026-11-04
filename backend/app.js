const express=require('express')
const db=require('./utils/db-connection')
const userRoute=require('./routes/userRoute')
const expenseRoute=require('./routes/expenseRoute')
const orderRoute=require('./routes/orderRoute')
const passwordRoute=require('./routes/passwordRoute')


const cors=require('cors')

const Expense = require('./models/expenseModel')
const User = require('./models/userModel')
const Order=require('./models/orderModel')
const ForgotPasswordRequest=require('./models/forgetPasswordRequestModel')
User.hasMany(Expense)
Expense.belongsTo(User);
User.hasMany(Order)
Order.belongsTo(User)
User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

require('dotenv').config({ quiet: true });

const app=express();
app.use(express.json())
app.use(cors());

app.use('/users',userRoute)
app.use('/expense',expenseRoute);
app.use('/order',orderRoute)
app.use('/password', passwordRoute);


const PORT=process.env.PORT

db.sync({force:false}).then(()=>{
    app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
}).catch((err)=>{
    console.log(err);
})