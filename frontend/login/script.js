const form = document.querySelector('#loginForm');
const api = 'http://localhost:3000/users';
const errorMessage = document.querySelector('#errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await axios.post(`${api}/login`, {
            email: email,
            password: password
        });

        alert('login successfully');

        localStorage.setItem('token', response.data.token);
        window.location.href = '../expense/index.html';

        console.log(response.data);

    } catch (error) {
        if (error.response) {
            errorMessage.textContent = error.response.data.message;
        } else {
            errorMessage.textContent = 'Something went wrong';
        }
    }
});


// Forgot Password functionality

const forgotPasswordLink = document.querySelector('#forgotPasswordLink');
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
const forgotMessage = document.querySelector('#forgotMessage');

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();

    forgotPasswordForm.style.display = 'block';
});

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    forgotMessage.textContent = '';

    const email = document.querySelector('#forgotEmail').value;

    try {
        const response = await axios.post(
            'http://localhost:3000/password/forgotpassword',
            {
                email: email
            }
        );

        forgotMessage.style.color = 'green';
        forgotMessage.textContent = response.data.message;

    } catch (error) {
        forgotMessage.style.color = 'red';

        if (error.response) {
            forgotMessage.textContent = error.response.data.message;
        } else {
            forgotMessage.textContent = 'Something went wrong';
        }
    }
});
