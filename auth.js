const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
const loginBtn = document.getElementById('SubmitBtn');

const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id: username, password: password })
});
const data = await response.json();
if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = '/admin';
}
    // git i przenosimy do panelu admina
    else {
        alert('Błędne dane logowania albo coś się spieprzyło: ' + data.message);
    }