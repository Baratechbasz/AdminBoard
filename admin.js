/*
if (localStorage.getItem('token') == null) {
    window.location.href = '/index.html';
}
*/
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
        window.location.href = '/index.html';
        return;
    }

    const data = await response.json();
    const adminName = document.getElementById('adminName');
    adminName.textContent = data.name;

    if (data.permissions.includes('MANAGE_POINTS')) {
        document.getElementById('manage').style.display = 'block';
    } else {
        document.getElementById('manage').style.display = 'none';
    }
}

async function fetchAllUsers() {
    const response = await fetch('/api/user/all', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    const data = await response.json();
    // Do something with the fetched user data, e.g., display it in a table

    data.forEach(user => {
        fetch(`/api/user/${user}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(userData => {
            const row = document.createElement('tr');
            row.id = `user-${userData.id}`;
            const cell = document.createElement('td');
            cell.textContent = userData.name;
            row.appendChild(cell);

            const cell1 = document.createElement('td');
            cell1.textContent = userData.positivePoints;
            row.appendChild(cell1);

            const cell2 = document.createElement('td');
            cell2.textContent = userData.negativePoints;
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = userData.specialPoints;
            row.appendChild(cell3);

            const tableBody = document.getElementById('tableBody');
            tableBody.appendChild(row);

            const userSelect = document.getElementById('userSelect');
        const option = document.createElement('option');
        option.value = userData.id;
        option.textContent = userData.name;
        userSelect.appendChild(option);


        })
        .catch(error => {
            console.error('Failed to fetch user details', error);
        });
    });
}

async function recentCommits() {
    const response = await fetch('/api/user/commits?count=31', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    const data = await response.json();
    const commitList = document.getElementById('commit');
    
    data.forEach(commit => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="commit-card">
                <div class="commit-header">
                    <span class="receiver">${commit.userId}</span>
                    <span class="${commit.operation === 'ADD' ? 'points-positive' : 'points-negative'}">${commit.operation === 'ADD' ? '+' : '-'}${commit.points}</span>
                    <span class="sender">punkty przez ${commit.adminId}</span>
                </div>
                <div class="commit-reason">
                    ${commit.reason} <br>
                    <small>(punkty: ${commit.pointsType})</small>
                </div>
                <div class="commit-date">
                    ${new Date(commit.timestamp).toLocaleString('pl-PL')}
                </div>
            </div>
        `;
        commitList.appendChild(listItem);
    });
}

async function logout() {
    await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    });
    localStorage.removeItem('token');
    window.location.href = '/login';
}

async function changePassword() {
    const currentPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('/api/user/me/password', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ old_password: currentPassword, new_password: newPassword })
    });

    if (response.ok) {
        document.getElementById(`passwordError`).style.color = 'green';
        document.getElementById('passwordError').textContent = 'Hasło zostało zmienione';
    } else if (response.status === 403) {
        document.getElementById('passwordError').textContent = 'Błędne stare hasło';
    }
}

async function addPoints() {
    const userId = document.getElementById('userSelect').value;
    const points = parseInt(document.getElementById('points').value);
    const pointsType = document.getElementById('pointsType').value;
    const reason = document.getElementById('reason').value;

    const response = await fetch(`/api/user/${userId}/points`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: userId, points, pointsType: pointsType, reason })
    });

    if (response.ok) {
        document.getElementById('manageModal').style.display = 'none';
    }
}


async function adminOfTheWeek() {
    const response = await fetch('/api/user/adminoftheweek', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
        return;
    }

    const data = await response.text();
    document.getElementById('user-' + data).style.backgroundColor = '#58e178';

    }

async function adminOfTheMonth() {
    const response = await fetch(`/api/user/adminofthemonth`, {
        method: `GET`,
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem(`token`)}`
        }
    });

    if (response.status === 401) {
        localStorage.removeItem(`token`)
        window.location.href = '/index.html'
        return;
    }

    const data = await response.text();
    document.getElementById('user-' + data).style.backgroundColor = '#e02c2c'
}

addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    fetchAllUsers();
    recentCommits();
    adminOfTheWeek();
    adminOfTheMonth();

    document.getElementById(`settings`).addEventListener('click', () => {
    document.getElementById(`settingsModal`).style.display = 'block';
});

document.getElementById(`manage`).addEventListener('click', () => {
    document.getElementById(`manageModal`).style.display = 'block';
});

document.getElementById(`closeSettings`).addEventListener('click', () => {
    document.getElementById(`settingsModal`).style.display = 'none';
});

document.getElementById(`closeManage`).addEventListener('click', () => {
    document.getElementById(`manageModal`).style.display = 'none';
});
document.getElementById(`logoutBtn`).addEventListener('click', logout);

document.getElementById(`changePasswordBtn`).addEventListener('click', changePassword);

document.getElementById(`addPointsBtn`).addEventListener('click', addPoints);

document.getElementById(`Rules`).addEventListener('click', () => {
    window.location.href = '/regulamin.html';
});
});
