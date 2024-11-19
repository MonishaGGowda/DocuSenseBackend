document.addEventListener('DOMContentLoaded', function () {
    function openPopupFunction() {
        const popupForm = document.getElementById('popupForm');
        if (popupForm) {
            popupForm.style.display = 'block';
        } 
    }
    window.openPopupFunction = openPopupFunction;

    const closeBtn = document.getElementById('closeBtn');
    const popupForm = document.getElementById('popupForm');

    if (closeBtn && popupForm) {
        closeBtn.addEventListener('click', function () {
            popupForm.style.display = 'none';
        });
    }

    window.addEventListener('click', function (event) {
        if (event.target === popupForm) {
            popupForm.style.display = 'none';
        }
    });
});
