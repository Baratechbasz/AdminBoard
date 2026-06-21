async function Login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id: username, password: password })
    });

    if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token', data.token);
        window.location.href = '/admin.html';
    }
    // git i przenosimy do panelu admina
    else {
        alert('Błędne dane logowania lub backend jest wyłączony. Proszę spróbować ponownie.');
    }
}

addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('SubmitBtn');
    loginBtn.addEventListener('click', Login);
});
