document.addEventListener('DOMContentLoaded', function () {
        fetch('/get_analyses/',{
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
           populateTable(data.analyses)
        })
        .catch(error => console.error('Error:', error));
    });

    // const data = [
    //     { name: 'Mystery Solving', description: 'Solving various mysteries' },
    //     { name: 'Find the Culprit', description: 'Identifying the suspect in cases' },
    // ];

    // const storedAnalyses = JSON.parse(localStorage.getItem('analyses')) || [];
    // const allAnalyses = data.concat(storedAnalyses);

document.addEventListener('DOMContentLoaded', function () {
    const tableContainer = document.querySelector('.table-container');
    tableContainer.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'deleteButton') {
            deleteSelected();
        }
    });
});