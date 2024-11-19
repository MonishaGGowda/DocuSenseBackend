document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        alert('Logged in successfully!');
        window.location.href = '../home_page/homepage.html';
    } else {
        alert('Please enter username and password.');
    }
});
document.getElementById('signup-btn').addEventListener('click', function() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (username && email && password) {
        alert('Signed up successfully!');
        window.location.href = '../home_page/homepage.html';
    } else {
        alert('Please fill all fields.');
    }
});