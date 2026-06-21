if (localStorage.getItem('token') == null) {
    window.location.href = '/index.html';
}

if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
}

async function Login() {

const username = document.getElementById('username').value;
const password = document.getElementById('password').value;

const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id: username, password: password })
});
const data = await response.json();
if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = '/admin.html';
}

    else {
        alert('Błędne dane logowania albo coś się spieprzyło: ' + data.message);
    }}

    addEventListener('DOMContentLoaded', () => {
        const loginBtn = document.getElementById('SubmitBtn');
    loginBtn.addEventListener('click', Login);
});
