const documents = [
    { name: "fbi.txt", content: "In the quaint village of Eldridge, the renowned sapphire necklace belonging to Lady Margaret has gone missing just days before her 80th birthday. As the townsfolk gather for the celebration, whispers of betrayal and hidden secrets surface. Detective Clara Thompson must sift through a web of jealousy and deceit to uncover the true thief before the night ends in scandal.", relevancy: "high", annotations: [], summary: "Lady Margaret has gone missing just days before her 80th birthday. Web of jealousy and deceit to uncover." },
    { name: "may31.txt", content: "Every night at precisely midnight, a chilling phone call echoes through the old Whitmore estate. The voice on the other end is unrecognizable, leaving cryptic messages that hint at a long-buried family secret. When young journalist Samira Collins decides to investigate, she uncovers a tale of lost love and revenge that could change everything she thought she knew about her family.", relevancy: "low", annotations: [], summary: "Chilling phone call echoes through the old Whitmore estate, every night at precisely midnight." },
    { name: "suspect.txt", content: "When art collector Julian Hart discovers an intricately carved puzzle box at an estate sale, he is drawn into a mystery that spans generations. Each piece he unlocks reveals clues about a tragic love story intertwined with a series of unsolved disappearances in the 1920s. As he delves deeper, Julian realizes he may be next in line to solve—or become a victim of—the box’s dark legacy.", relevancy: "high", annotations: [], summary:"art collector Julian Hart, carved puzzle box at an estate sale." },
  ];
  
let filteredDocuments = [...documents]; 
let selectedDocument = null; 
let highlighterEnabled = false; 

const urlParams = new URLSearchParams(window.location.search);
const documentName = urlParams.get('document');

if (documentName) {
    const documentIndex = documents.findIndex(doc => doc.name === documentName);
    if (documentIndex !== -1) {
        selectDocument(documentIndex);
    }
}

const analysisToDocumentsMap = {
  'Mystery Solving': ['fbi.txt', 'suspect.txt'],
  'Find the Culprit': ['may31.txt'],
};

const urlParamsAnalysis = new URLSearchParams(window.location.search);
var analysisName = urlParamsAnalysis.get('analysis');
const docName = urlParamsAnalysis.get('document');

if (docName) {
  const documentIndex = documents.findIndex(doc => doc.name === documentName);
  if (documentIndex !== -1) {
      selectDocument(documentIndex); 
  }
}

if(!analysisName){
  analysisName = Object.keys(analysisToDocumentsMap).find(key => 
  analysisToDocumentsMap[key].includes(docName)
);
}

if (analysisName) {
  document.getElementById('analysisTitle').textContent = `Data Analyse - Annotate Document: ${analysisName}`;
}

if (analysisName && analysisToDocumentsMap[analysisName]) {
  filteredDocuments = documents.filter(doc => analysisToDocumentsMap[analysisName].includes(doc.name));
} else {
  filteredDocuments = [...documents]; 
}

function renderDocumentList() {
  document.addEventListener("DOMContentLoaded", () => {
    const documentList = document.getElementById("documentList");
    
    if (documentList) {
      documentList.innerHTML = ''; 
      filteredDocuments.forEach((doc, index) => {
        const li = document.createElement("li");
    
        const docLink = document.createElement("a");
        docLink.href = `../annotation/annotation.html?document=${encodeURIComponent(doc.name)}`; 
        docLink.textContent = doc.name; 
        li.appendChild(docLink);
    
        const relevancySelect = document.createElement("select");
        relevancySelect.innerHTML = `
          <option value="high" ${doc.relevancy === "high" ? "selected" : ""}>High</option>
          <option value="low" ${doc.relevancy === "low" ? "selected" : ""}>Low</option>
        `;
        relevancySelect.onchange = () => changeRelevancy(index, relevancySelect.value);
        li.appendChild(relevancySelect);
    
        documentList.appendChild(li); 
      });
    } else {
        console.error("Element with ID 'documentList' not found.");
    }
  });
}

function selectDocument(index) {
  selectedDocument = filteredDocuments[index];
  const documentContainer = document.getElementById("documentContainer");
  const annotationsContainer = document.getElementById("annotationsContainer");

  documentContainer.innerHTML = selectedDocument.content;
  annotationsContainer.innerHTML = "";
  selectedDocument.annotations.forEach(annotation => {
    const annotationDiv = document.createElement("div");
    annotationDiv.classList.add(selectedDocument.relevancy === 'high' ? 'high-relevancy' : 'low-relevancy');
    annotationDiv.innerHTML = `
      ${annotation} <button onclick="showAnnotationPopup('${annotation}')">Edit</button>
    `;
    annotationsContainer.appendChild(annotationDiv);
  });
}


function changeRelevancy(index, newRelevancy) {
  filteredDocuments[index].relevancy = newRelevancy;
  if (filteredDocuments[index] === selectedDocument) {
    selectDocument(index);
  }
}

function filterDocuments() {
  const searchText = document.getElementById("searchBox").value.toLowerCase();
  filteredDocuments = documents.filter(doc => doc.content.toLowerCase().includes(searchText));
  renderDocumentList();
}

function clearFilter() {
  document.getElementById("searchBox").value = ""; 
  filteredDocuments = [...documents];
  renderDocumentList();
}

function toggleHighlighter() {
  highlighterEnabled = !highlighterEnabled;
  const highlighterButton = document.getElementById("highlightButton");
  highlighterButton.textContent = highlighterEnabled ? "Disable Highlighter" : "Enable Highlighter";
}

let selectedText = '';

function highlightText() {
  if (!highlighterEnabled) return;

  const documentContainer = document.getElementById("documentContainer");
  const selection = window.getSelection();
  selectedText = selection.toString();
  
  if (selectedText) {
    const highlighted = `<span class="highlight">${selectedText}</span>`;
    documentContainer.innerHTML = documentContainer.innerHTML.replace(selectedText, highlighted);
    selection.removeAllRanges(); 
    showAnnotationPopup(selectedText);
  }
}

function showAnnotationPopup(annotation = '') {
  const popup = document.getElementById("annotationPopup");
  const textarea = document.getElementById("annotationText");
  textarea.value = annotation; 
  popup.style.display = "block"; 
}

function saveAnnotation() {
  const textarea = document.getElementById("annotationText");
  const newAnnotation = textarea.value.trim(); 

  if (newAnnotation === "") {
    alert("Please enter an annotation before saving.");
    return; 
  }

  if (!selectedDocument.annotations.includes(newAnnotation) && newAnnotation.trim() !== "") {
    selectedDocument.annotations.push(newAnnotation);
  }

  document.getElementById("annotationPopup").style.display = "none";
  
  const annotationsContainer = document.getElementById("annotationsContainer");
  const annotationDiv = document.createElement("div");
  annotationDiv.classList.add(selectedDocument.relevancy === 'high' ? 'high-relevancy' : 'low-relevancy');
  annotationDiv.innerHTML = `
    ${newAnnotation} 
    <button onclick="showAnnotationPopup('${newAnnotation}')">Edit</button>
    <button onclick="removeAnnotation('${newAnnotation}')">Remove</button>
  `;
  annotationsContainer.appendChild(annotationDiv);
  
  textarea.value = "";
}

function removeAnnotation(annotationText) {
  selectedDocument.annotations = selectedDocument.annotations.filter(annotation => annotation !== annotationText);
  const annotationsContainer = document.getElementById("annotationsContainer");
  const annotationDivs = annotationsContainer.querySelectorAll("div");

  annotationDivs.forEach(div => {
      if (div.innerText.includes(annotationText)) {
          annotationsContainer.removeChild(div);
      }
  });
}

function updateAnnotationsPane() {
  const annotationsContainer = document.getElementById("annotationsContainer");
  annotationsContainer.innerHTML = selectedDocument.annotations.map(annotation => `
    <div class="${selectedDocument.relevancy === 'high' ? 'high-relevancy' : 'low-relevancy'}">
      ${annotation}
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const documentContainer = document.getElementById("documentContainer");
  
  if (documentContainer) {
      documentContainer.addEventListener("mouseup", highlightText);
  } else {
      console.error("Element with ID 'documentContainer' not found.");
  }
});

function closeAnnotationPopup() {
  document.getElementById("annotationPopup").style.display = "none";
}

renderDocumentList();
function uploadDocuments() {
  const fileInput = document.getElementById("fileUpload");
  const files = fileInput.files; 

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "text/plain") {
        const reader = new FileReader();

        reader.onload = function (event) {
          const fileContent = event.target.result;

          const newDocument = {
            name: file.name,
            content: fileContent,
            annotations: [],
            relevancy: "low" 
          };
          documents.push(newDocument);
          filteredDocuments.push(newDocument);
          renderDocumentList();
        };

        reader.readAsText(file);
      } else {
        alert("Please upload only .txt files.");
      }
    }
  } else {
    alert("No files selected for upload.");
  }
}
function updateDocumentsList() {
  const documentsList = document.getElementById("documentsList");
      documentsList.innerHTML = "";
      documents.forEach((doc, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = doc.title;
        listItem.onclick = function () {
          selectDocument(index);
        };
        documentsList.appendChild(listItem);
      });
}


function getCheckedSummaryType() {
  const checkedRadioButton = document.querySelector('input[name="summaryType"]:checked');
  if (checkedRadioButton) {
    return checkedRadioButton.value; 
  } else {
    return null;
  }
}

function loadViewPage(){
    window.location = viewPageUrl;
}

function viewCreatePage(){
    window.location = "../annotation/annotation.html"
}

var items = [];

function populateTable(data) {
    items =  data;
    const tableBody = document.querySelector('#analysis-table tbody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = `<td colspan="3">No data available</td>`;
      tableBody.appendChild(noDataRow);
      return;
  }

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="delete-checkbox" data-index="${index}"></td> 
            <td><a href="${annotationPageUrl}?analysis=${encodeURIComponent(item.name)}">${item.name}</a></td>
            <td>${item.description}</td>
        `;
        tableBody.appendChild(row);
    });

    const rowsToAdd = 10 - data.length;
    for (let i = 0; i < rowsToAdd; i++) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

function deleteSelected() {
  const checkboxes = document.querySelectorAll('.delete-checkbox:checked');
  const indicesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index, 10)); 
  const namesToDelete = Array.from(checkboxes).map(checkbox => checkbox.closest('tr').querySelector('td:nth-child(2) a').textContent);

  console.log('Indices to delete:', indicesToDelete);
  const updatedItems = items.filter((_, index) => !indicesToDelete.includes(index));

    if (namesToDelete.length === 0) {
        alert('No items selected for deletion.');
        return;
    }
    fetch('/delete_analyses/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') // Add CSRF token for security
      },
      body: JSON.stringify({ names: namesToDelete })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(data.message);
          fetch('/get_analyses/',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Parse the response as JSON
      })
      .then(item => {
          console.log('Updated analyses:', item.analyses); // Debug log for fetched data
          populateTable(item.analyses); // Update table with fresh data
      }).catch(error => console.error('Error refreshing data:', error));
      } else {
          alert(data.message);
      }
  })
    // const updatedAnalyses = items.filter((_, index) => !indicesToDelete.includes(index.toString()));

    // localStorage.setItem('analyses', JSON.stringify(updatedAnalyses));
    // populateTable(updatedAnalyses);
}


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