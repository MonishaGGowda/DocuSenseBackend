
document.addEventListener('DOMContentLoaded', function () {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const submitBtn = document.querySelector('.submit-btn');

    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', openPopupFunction);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const name = document.getElementById('name').value.trim();
            const desc = document.getElementById('desc').value.trim();

            if (name && desc) {
                fetch('/save_analysis/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') 
                    },
                    body: JSON.stringify({ name: name, description: desc })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        document.getElementById('popupForm').style.display = 'none';
                        document.getElementById('name').value = '';
                        document.getElementById('desc').value = '';
                        window.location = '/view_page/';
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                alert('Please fill in both fields.');
            }
        });
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
