
const annotations = [
    {
        title: "quaint village of Eldridge",
        source: "fbi.txt",
        sourceLink: "fbi.txt",
        description: "Tells about the place of suspect.",
        dateAdded: "2024-10-10",
        tags: ["high"]
    },
    {
        title: "Whitmore estate",
        source: "may31.txt",
        sourceLink: "document2.html",
        description: "Information that might be useful.",
        dateAdded: "2024-10-11",
        tags: ["low"]
    },
    {
        title: "Samira Collins",
        source: "may31.txt",
        sourceLink: "may31.txt",
        description: "Maybe helper?",
        dateAdded: "2024-10-12",
        tags: ["high"]
    },
    {
        title: "Julian Hart discovers",
        source: "suspect.txt",
        sourceLink: "suspect.txt",
        description: "Seems fishy?",
        dateAdded: "2024-10-12",
        tags: ["high"]
    }
];

const cardListContainer = document.querySelector('.card-list');

function displayAnnotations(filteredAnnotations) {
cardListContainer.innerHTML = ''; 
filteredAnnotations.forEach(annotation => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <h3 class="annotation-title">${annotation.title}</h3>
        <p class="source-document">
            Source: <a href="../annotation/annotation.html?document=${encodeURIComponent(annotation.source)}">${annotation.source}</a>
        </p>
        <p class="annotation-text">${annotation.description}</p>
        <p class="annotation-meta">
            Date Added: ${annotation.dateAdded}<br>
        </p>
        <p class="annotation-tags">
            Tags: 
            ${annotation.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')}
        </p>
    `;

    cardListContainer.appendChild(card);
});
}

const tagSelect = document.getElementById('tagSelect');
const filterInput = document.getElementById('filterInput');

tagSelect.addEventListener('change', function() {
    const selectedTag = tagSelect.value;
    const filteredAnnotations = annotations.filter(annotation =>
        annotation.tags.includes(selectedTag)
    );
    displayAnnotations(filteredAnnotations);
});

filterInput.addEventListener('input', function() {
    const searchTerm = filterInput.value.toLowerCase();
    tagSelect.selectedIndex = 0; 
    const filteredAnnotations = annotations.filter(annotation =>
        annotation.title.toLowerCase().includes(searchTerm)
    );
    displayAnnotations(filteredAnnotations);
});

resetButton.addEventListener('click', function() {
    filterInput.value = ''; 
    tagSelect.selectedIndex = 0; 
    displayAnnotations(annotations); 
});

function populateTagSelect() {
    const tags = new Set();
    annotations.forEach(annotation => {
        annotation.tags.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}


populateTagSelect();
displayAnnotations(annotations);