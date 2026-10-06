const express=require('express')
const db=require('./utils/db-connection')
const userRoute=require('./routes/userRoute')
const expenseRoute=require('./routes/expenseRoute')

const cors=require('cors')

const Expense = require('./models/expenseModel')
const User = require('./models/userModel')
User.hasMany(Expense)
Expense.belongsTo(User);
require('dotenv').config();

const app=express();
app.use(express.json())
app.use(cors());

app.use('/users',userRoute)
app.use('/expense',expenseRoute);

const PORT=process.env.PORT

db.sync({force:false}).then(()=>{
    app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
}).catch((err)=>{
    console.log(err);
})