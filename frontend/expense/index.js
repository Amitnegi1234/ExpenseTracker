const form = document.querySelector('#expenseForm');
const api = 'http://localhost:3000/expense';
const expensesList = document.querySelector('#expensesList');



const leaderboardBtn = document.querySelector('#leaderboardBtn');
const leaderboardContainer = document.querySelector('#leaderboardContainer');
const leaderboardList = document.querySelector('#leaderboardList');
const leaderboardMessage = document.querySelector('#leaderboardMessage');


const userApi = 'http://localhost:3000/users';

async function loadPremiumStatus() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const response = await axios.get(`${userApi}/me`, {
            headers: {
                authorization: token
            }
        });

        if (response.data.isPremium) {
            buyPremiumBtn.hidden = true;
            premiumUserSection.hidden = false;
        } else {
            buyPremiumBtn.hidden = false;
            premiumUserSection.hidden = true;
        }

    } catch (error) {
        console.log('Could not load premium status:', error);
    }
}

const buyPremiumBtn = document.querySelector('#buyPremiumBtn');
const premiumUserSection = document.querySelector('#premiumUserSection');
const paymentMessage = document.querySelector('#paymentMessage');

// Backend API URL
const orderApi = 'http://localhost:3000/order';

// Create Cashfree checkout
buyPremiumBtn.addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            paymentMessage.textContent = 'Please log in first.';
            return;
        }

        buyPremiumBtn.disabled = true;
        paymentMessage.textContent = 'Creating payment order...';

        const response = await axios.post(
            `${orderApi}/create`,
            {},
            {
                headers: { authorization: token }
            }
        );

        const paymentSessionId =
            response.data.cashfreeOrder.payment_session_id;

        const cashfree = Cashfree({ mode: 'sandbox' });

        await cashfree.checkout({
            paymentSessionId: paymentSessionId,
            redirectTarget: '_self'
        });

    } catch (error) {
        console.log(error);
        paymentMessage.textContent =
            error.response?.data?.message || 'Unable to start payment.';
        buyPremiumBtn.disabled = false;
    }
});

// Verify payment after Cashfree redirects back

async function checkPayment() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');

    if (!orderId) return;

    const token = localStorage.getItem('token');

    if (!token) {
        paymentMessage.textContent = 'Please log in first to verify payment.';
        return;
    }

    try {
        paymentMessage.textContent = 'Verifying payment...';

        const response = await axios.post(
            `${orderApi}/verify`,
            { orderId },
            {
                headers: { authorization: token }
            }
        );

        if (response.data.paymentStatus === 'SUCCESS') {
            buyPremiumBtn.hidden = true;
            premiumUserSection.hidden = false;
            paymentMessage.textContent = 'Payment successful!';
        } else if (response.data.paymentStatus === 'PENDING') {
            paymentMessage.textContent =
                'Payment is pending. Please check again shortly.';
        } else {
            paymentMessage.textContent =
                'Payment failed. You can try again.';
            buyPremiumBtn.disabled = false;
        }

        // Remove order_id after the backend responds
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    } catch (error) {
        console.log(error);

        paymentMessage.textContent =
            error.response?.data?.message ||
            'Could not verify payment. Please try again.';
    }
}

async function initializePage() {
    await checkPayment();
    await loadPremiumStatus();
}

initializePage();


async function loadLeaderboard() {
    const token = localStorage.getItem('token');

    if (!token) {
        leaderboardMessage.textContent = 'Please log in first.';
        return;
    }

    leaderboardMessage.textContent = 'Loading leaderboard...';
    leaderboardList.replaceChildren();

    try {
        const response = await axios.get(
            `${api}/leaderboard`,
            {
                headers: { authorization: token }
            }
        );

        leaderboardList.replaceChildren();

        if (response.data.length === 0) {
            leaderboardMessage.textContent = 'No expenses to show yet.';
            return;
        }

        leaderboardMessage.textContent = '';

        response.data.forEach((user, index) => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const totalCell = document.createElement('td');

            const rank = index + 1;
            rankCell.className = 'leaderboard-rank';
            rankCell.textContent =
                rank === 1 ? '🥇 1st' :
                rank === 2 ? '🥈 2nd' :
                rank === 3 ? '🥉 3rd' :
                `#${rank}`;

            nameCell.className = 'leaderboard-user';
            nameCell.textContent = user.name;

            totalCell.className = 'leaderboard-total';
            totalCell.textContent =
                `₹${Number(user.totalExpense).toLocaleString('en-IN')}`;

            row.append(rankCell, nameCell, totalCell);
            leaderboardList.appendChild(row);
        });

    } catch (error) {
        console.log('Leaderboard error:', error);
        leaderboardMessage.textContent =
            error.response?.status === 403
                ? 'Premium membership is required to view the leaderboard.'
                : 'Unable to load leaderboard. Please try again.';
    }
}

leaderboardBtn.addEventListener('click', async () => {
    const isHidden = leaderboardContainer.hidden;

    leaderboardContainer.hidden = !isHidden;
    leaderboardBtn.textContent = isHidden
        ? 'Hide Leaderboard'
        : 'Leaderboard';

    if (isHidden) {
        await loadLeaderboard();
    }
});

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