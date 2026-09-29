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
        
        getUsers();
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

async function getUsers() {
    try {
        const response = await axios.get(`${api}/get`);
        const users = response.data;

        displayUser(users);

    } catch (error) {
        console.log(error);
    }
}

async function displayUser(users) {
    try {
        usersList.innerHTML = '';

        users.forEach(user => {
            const div = document.createElement('div');

            div.classList.add('users-list');

            div.innerHTML = `
                <div class='user-detail'>
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            `;

            usersList.appendChild(div);
        });

    } catch (error) {
        console.log(error);
    }
}

getUsers();

