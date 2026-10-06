const form = document.querySelector('#userForm');
const api = 'http://localhost:3000/users';
const usersList = document.querySelector('#usersList');
const emailError = document.querySelector('#emailError');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    emailError.textContent = '';
    const formData = new FormData(e.target);

    const user = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await axios.post(`${api}/add`, user);
        alert('register successfully')
        window.location.href = '../login/index.html';
        e.target.reset();
    } catch (error) {

        if (error.response && error.response.status === 409) {
            emailError.textContent = error.response.data.message;
        } else {
            message.textContent = 'Something went wrong';
        }
        console.log(error);
    }
});

