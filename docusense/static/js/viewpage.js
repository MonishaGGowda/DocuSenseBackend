document.addEventListener('DOMContentLoaded', function () {
    const data = [
        { name: 'Mystery Solving', description: 'Solving various mysteries' },
        { name: 'Find the Culprit', description: 'Identifying the suspect in cases' },
    ];

    const storedAnalyses = JSON.parse(localStorage.getItem('analyses')) || [];
    const allAnalyses = data.concat(storedAnalyses);

    populateTable(allAnalyses);
});