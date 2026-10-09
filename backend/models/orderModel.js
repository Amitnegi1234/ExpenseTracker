const {DataTypes}=require('sequelize')
const sequelize=require('../utils/db-connection')

const Orders=sequelize.define('orders',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true, 
        primaryKey:true 
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:'PENDING'
    }
})

module.exports=Orders;