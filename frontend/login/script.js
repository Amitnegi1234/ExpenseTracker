const form=document.querySelector('#loginForm');
const api='http://localhost:3000/users';
const errorMessage = document.querySelector('#errorMessage');

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    errorMessage.textContent = '';
    const formData=new FormData(form);
    const email=formData.get('email');
    const password=formData.get('password');
    try {
        const response=await axios.post(`${api}/login`,{
            email:email,
            password:password
        })
        alert('login successfully')
        console.log(response.data);
    } catch (error) {
        if (error.response) {
            errorMessage.textContent = error.response.data.message; 
        } else { 
            errorMessage.textContent = 'Something went wrong'; 
        }
    }
})