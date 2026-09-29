const express=require('express')
const db=require('./utils/db-connection')
const userRoute=require('./routes/userRoute')
const cors=require('cors')

require('./models/userModel')
const app=express();
app.use(express.json())
app.use(cors())

app.use('/users',userRoute)

const PORT=3000;

db.sync({force:false}).then(()=>{
    app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
}).catch((err)=>{
    console.log(err);
})