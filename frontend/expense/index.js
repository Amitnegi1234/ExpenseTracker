const form = document.querySelector('#expenseForm');
const api = 'http://localhost:3000/expense';
const expensesList = document.querySelector('#expensesList');

const descriptionInput = document.querySelector("#description");
const categorySelect = document.querySelector("#category");

const leaderboardBtn = document.querySelector('#leaderboardBtn');
const leaderboardContainer = document.querySelector('#leaderboardContainer');
const leaderboardList = document.querySelector('#leaderboardList');
const leaderboardMessage = document.querySelector('#leaderboardMessage');


let allExpenses = [];
let currentPage = 1;

const allowedPageSizes = [2, 3, 5, 8, 10, 20, 30, 40];

const savedPageSize = Number(localStorage.getItem('expensesPerPage'));

let expensesPerPage = allowedPageSizes.includes(savedPageSize)
    ? savedPageSize
    : 3;

const pageSizeSelect = document.querySelector('#pageSize');

pageSizeSelect.value = String(expensesPerPage);

// Make sure the dropdown shows the saved preference
pageSizeSelect.value = String(expensesPerPage);

const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const pageInfo = document.querySelector('#pageInfo');

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
    const note = formData.get('note');
    const category=formData.get('category');
    const expense={
        amount:amount,
        description:description,
        note:note,
        category:category,
    }
    try {
        const token=localStorage.getItem('token')
        const response=await axios.post(`${api}/add`,expense,{
            headers:{"authorization":token}
        })
        e.target.reset();
        currentPage = 1;
        await  getExpense();
    } catch (error) {
        console.log(error);
    }
})

async function getExpense() {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${api}/get`, {
            headers: {
                authorization: token
            }
        });

        allExpenses = response.data;

        const totalPages = Math.max(
            1,
            Math.ceil(allExpenses.length / expensesPerPage)
        );

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        displayExpenses();

    } catch (error) {
        console.log('Get expense error:', error);
    }
}

function displayExpenses() {
    expensesList.innerHTML = '';

    const totalPages = Math.max(
        1,
        Math.ceil(allExpenses.length / expensesPerPage)
    );

    // Make sure currentPage is always a valid page
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    if (currentPage < 1) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * expensesPerPage;
    const endIndex = startIndex + expensesPerPage;

    const currentExpenses = allExpenses.slice(startIndex, endIndex);

    currentExpenses.forEach(expense => {
        const div = document.createElement('div');
        div.className = 'expense-card';

        const info = document.createElement('div');
        info.className = 'expense-info';

        const title = document.createElement('h3');
        title.textContent = expense.description;

        const category = document.createElement('p');
        category.textContent = `Category: ${expense.category}`;

        const note = document.createElement('p');
        note.textContent = `Note: ${expense.note}`;

        info.append(title, category, note);

        const right = document.createElement('div');
        right.className = 'expense-right';

        const amount = document.createElement('span');
        amount.className = 'expense-amount';
        amount.textContent = `₹${expense.amount}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', () => {
            deleteExpense(expense.id);
        });

        right.append(amount, deleteBtn);
        div.append(info, right);

        expensesList.appendChild(div);
    });

    // Update pagination information
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}


const deleteExpense = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${api}/delete/${id}`, {
            headers: {
                "authorization": token
            }
        });
        await getExpense();
    } catch (error) {
        console.log(error);
    }
};

descriptionInput.addEventListener("blur", async () => {
    const description = descriptionInput.value.trim();

    if (!description) return;

    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:3000/expense/suggest-category",
            {
                description: description
            },
            {
                headers: {
                    authorization: token
                }
            }
        );

        categorySelect.value = response.data.category;

    } catch (error) {
        console.log("AI suggestion error:", error);
    }
});

const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {

    // Remove current user's authentication details
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = '../login/index.html';

});



nextBtn.addEventListener('click', () => {

    const totalPages = Math.ceil(
        allExpenses.length / expensesPerPage
    );

    if (currentPage < totalPages) {
        currentPage++;
        displayExpenses();
    }

});


prevBtn.addEventListener('click', () => {

    if (currentPage > 1) {
        currentPage--;
        displayExpenses();
    }

});

pageSizeSelect.addEventListener('change', () => {
    expensesPerPage = Number(pageSizeSelect.value);
    localStorage.setItem('expensesPerPage', expensesPerPage);
    currentPage = 1;

    displayExpenses();
});

getExpense()