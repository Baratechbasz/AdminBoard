if (localStorage.getItem('token') == null) {
    window.location.href = '/login';
}

async function fetchUserData() {
    const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    
    const data = await response.json();
    const adminName = document.getElementById('adminName').textContent = data.name;

}

addEventListener('DOMContentLoaded', () => {
    fetchUserData();
});