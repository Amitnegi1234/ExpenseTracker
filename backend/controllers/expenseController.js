const Expense=require('../models/expenseModel')
const User=require('../models/userModel')
const sequelize=require('../utils/db-connection')

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


const getLeaderboard = async (req, res) => {
    try {
        // Check whether the logged-in user is premium
        const currentUser = await User.findByPk(req.user.id);

        if (!currentUser || !currentUser.isPremium) {
            return res.status(403).json({
                message: 'Premium membership is required'
            });
        }

        // Calculate each user's total expenses
        const expenses = await Expense.findAll({
            attributes: [
                'UserId',
                [
                    sequelize.fn('SUM', sequelize.col('amount')),
                    'totalExpense'
                ]
            ],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                    required: true
                }
            ],
            group: ['UserId', 'User.id', 'User.name'],
            order: [[sequelize.literal('totalExpense'), 'DESC']]
        });

        const leaderboard = expenses.map((expense) => ({
            name: expense.User.name,
            totalExpense: Number(expense.get('totalExpense'))
        }));

        return res.status(200).json(leaderboard);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Unable to load leaderboard'
        });
    }
};

module.exports={
    addExpense, getExpense, deleteExpense, getLeaderboard
}