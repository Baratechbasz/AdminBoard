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
        return;
    }

    const data = await response.json();
    const adminName = document.getElementById('adminName');
    adminName.textContent = data.name;
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
        listItem.textContent = `${commit.userId} - ${commit.points} pkt. (${commit.type}), ${commit.reason} `;
        commitList.appendChild(listItem);
    });
}

addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    fetchAllUsers();
    recentCommits();
});
