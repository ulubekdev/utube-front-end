const API = 'https://utube-back-end.herokuapp.com';

const form = document.querySelector('.site-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    formData.append('username', form.usernameInput.value);
    formData.append('password', form.passwordInput.value);

    form.usernameInput.value = '';
    form.passwordInput.value = '';

    try {
        let response = await fetch(`${API}/login`, {
            method: 'POST',
            body: formData
        });

        let data = await response.json();
        
        if (data.status == 200) {
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('userImg', data.data.userImg);

            window.location = '/'
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