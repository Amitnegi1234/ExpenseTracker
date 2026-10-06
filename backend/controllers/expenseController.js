const Expense=require('../models/expenseModel')

const addExpense=async(req,res)=>{
    try {
        const {amount, category, description}=req.body;
        const expense=await Expense.create({
            amount:amount,
            category:category,
            description:description,
            UserId:req.user.id
        })
        return res.status(201).json({
            message:"Expense added successfully",
            expense:expense
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}

const getExpense=async(req,res)=>{
    try {
        const expenses=await Expense.findAll({
            where:{
                UserId : req.user.id  //req.user is a global object
            }
        });
        if(expenses.length==0){
            return res.status(404).send('No expense found');
        }
        return res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"something went wrong"
        });
    }
}
const deleteExpense=async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteExpense=await Expense.destroy({
            where:{
                id:id,
            }
        })
        if (deleteExpense === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }
        return res.status(200).json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}
module.exports={
    addExpense, getExpense, deleteExpense
}