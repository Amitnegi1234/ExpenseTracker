
const form = document.querySelector('#resetPasswordForm');
const message = document.querySelector('#message');

// Extract UUID from URL
const params = new URLSearchParams(window.location.search);
const requestId = params.get('id');

async function checkResetLink() {
    try {
        const response = await axios.get(
            `http://localhost:3000/password/resetpassword/${requestId}`
        );

        message.textContent = response.data.message;

    } catch (error) {
        form.style.display = 'none';
        message.textContent =
            error.response?.data?.message || 'Invalid reset link';
    }
}
if (requestId) {
    checkResetLink();
} else {
    form.style.display = 'none';
    message.textContent = 'Reset link ID is missing';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:3000/password/updatepassword/${requestId}`,
            { password: password }
        );

        message.textContent = response.data.message;

        form.reset();

    } catch (error) {
        message.textContent =
            error.response?.data?.message || 'Something went wrong';
    }
});
