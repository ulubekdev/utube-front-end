const API = 'http://localhost:5000';

const form = document.querySelector('.site-form');
const makeAdmin = document.querySelector('.makeAdmin');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    formData.append('username', form.usernameInput.value);
    formData.append('password', form.passwordInput.value);
    formData.append('image', form.uploadInput.files[0]);

    form.usernameInput.value = '';
    form.passwordInput.value = '';
    form.uploadInput.value = '';

    try {
        let response = await fetch(`${API}/register`, {
            method: 'POST',
            body: formData
        });

        let data = await response.json();
        
        if (data.status == 201) {
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('userImg', data.data.userImg);

            window.location = '/';
            makeAdmin.setAttribute('href', '/admin');
        } else {
            errorMessage.textContent = data.message
        }
        
    } catch(err) {
        console.log(err);
    }
});

showButton.onclick = () => {
    if (showButton.classList.contains('zmdi-eye')) {
        showButton.classList.remove('zmdi-eye');
        showButton.classList.add('zmdi-eye-off');
        passwordInput.type = 'text';
    } else {
        showButton.classList.remove('zmdi-eye-off');
        showButton.classList.add('zmdi-eye');
        passwordInput.type = 'password';
    }
}