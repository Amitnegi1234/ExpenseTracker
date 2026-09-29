const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('users','root','Amitnegi123',{
    host:'localhost',
    dialect:'mysql'
});

(async()=>{
    try {
        await sequelize.authenticate();
        console.log('database connected');
    } catch (error) {
        console.log(error);
    }
})()

module.exports=sequelize;