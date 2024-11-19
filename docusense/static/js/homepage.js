
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
            const viewPageUrl = "{% url 'view_page' %}";
            if (name && desc) {
                const newAnalysis = { name: name, description: desc };
                let analyses = JSON.parse(localStorage.getItem('analyses')) || [];
                analyses.push(newAnalysis);
                localStorage.setItem('analyses', JSON.stringify(analyses));
                document.getElementById('popupForm').style.display = 'none';
                document.getElementById('name').value = '';
                document.getElementById('desc').value = '';
                window.location = viewPageUrl;
            } else {
                alert('Please fill in both fields.');
            }
        });
    }
});
