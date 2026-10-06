const form = document.querySelector('#expenseForm');
const api = 'http://localhost:3000/expense';

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount=formData.get('amount');
    const description=formData.get('description');
    const category=formData.get('category');
    const expense={
        amount:amount,
        description:description,
        category:category,
    }
    try {
        const token=localStorage.getItem('token')
        const response=await axios.post(`${api}/add`,expense,{
            headers:{"authorization":token}
        })
        e.target.reset();
        getExpense();
    } catch (error) {
        console.log(error);
    }
})

const getExpense=async()=>{
    try {
        const token = localStorage.getItem('token')
        console.log("token from localStorage:", token);
        const response=await axios.get(`${api}/get`,{
            headers:{"authorization":token}
        }) 
        expensesList.innerHTML = '';
        response.data.forEach((expense) => {
            const div = document.createElement('div');
            div.className = 'expense-card';
            div.innerHTML = `
                <div class="expense-info">
                    <h3>${expense.description}</h3>
                    <p>Category: ${expense.category}</p>
                </div>
                <div class="expense-amount">
                    ₹${expense.amount}
                </div>
                <button 
                    class="delete-btn" onclick="deleteExpense(${expense.id})">Delete
                </button>
            `;
            expensesList.appendChild(div);
        });
    } catch (error) {
        console.log(error);
        expensesList.innerHTML = `
            <p class="no-expense">No expenses</p>
        `;
    }
}


const deleteExpense = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${api}/delete/${id}`, {
            headers: {
                "authorization": token
            }
        });
        getExpense();
    } catch (error) {
        console.log(error);
    }
};

getExpense()