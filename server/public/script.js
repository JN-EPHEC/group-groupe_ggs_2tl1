document.addEventListener('DOMContentLoaded', async function () {
    await loadUsers();

    const form = document.getElementById('userForm');
    form.addEventListener('submit', onFormSubmit);
});


async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();

    let html = '';
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        html +=
            '<li>' +
            user.firstName + ' ' + user.lastName +
            ' <button onclick="deleteUser(' + user.id + ')">X</button>' +
            '</li>';
    }

    document.getElementById('usersList').innerHTML = html;
}

async function onFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName
        })
    });

    document.getElementById('userForm').reset();
    await loadUsers(); // rafraichit la liste sans reload
}

async function deleteUser(id) {
  await fetch('/api/users/' + id, {
    method: 'DELETE'
  });

  await loadUsers(); // recharge la liste
}

window.deleteUser = deleteUser;

