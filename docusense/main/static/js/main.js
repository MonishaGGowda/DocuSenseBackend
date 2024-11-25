// function addHighlightCSS() {
//   const style = document.createElement("style");
//   style.type = "text/css";
//   style.innerHTML = `
//       .highlight {
//           background-color: yellow;
//           font-weight: bold;
//           padding: 2px;
//           border-radius: 3px;
//       }
//   `;
//   document.head.appendChild(style);
// }

// // Call this function once when your page loads
// addHighlightCSS();
const documents = [];
  
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
  fetch("/api/get-uploaded-documents/")
      .then(response => response.json())
      .then(data => {
          const documentList = document.getElementById("documentList");
          documentList.innerHTML = ""; // Clear the list

          data.forEach(doc => {
              const li = document.createElement("li");

              const docLink = document.createElement("a");
              docLink.href = "#";
              docLink.textContent = doc.name;
              docLink.onclick = () => selectDocument(doc.name);

              const relevancySelect = document.createElement("select");
              relevancySelect.innerHTML = `
                  <option value="high" ${doc.relevancy === "high" ? "selected" : ""}>High</option>
                  <option value="low" ${doc.relevancy === "low" ? "selected" : ""}>Low</option>
              `;
              relevancySelect.onchange = () => updateDocumentRelevancy(doc.name, relevancySelect.value);

              li.appendChild(docLink);
              li.appendChild(relevancySelect);
              documentList.appendChild(li);
          });
      })
      .catch(error => console.error("Error fetching document list:", error));
}

function updateDocumentRelevancy(documentName, newRelevancy) {
  fetch("/api/update-relevancy/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
      body: JSON.stringify({ document_name: documentName, relevancy: newRelevancy })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(`Relevancy for ${documentName} updated to ${newRelevancy}`);
      } else {
          alert(data.error || "Error updating relevancy.");
      }
  })
  .catch(error => console.error("Error updating relevancy:", error));
}


document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const documentName = urlParams.get("document");

  if (documentName) {
      console.log(`Document pre-selected: ${documentName}`); // Debug log
      selectDocument(documentName); // Automatically load document and annotations
  } else {
      console.log("No document pre-selected.");
  }

  renderDocumentList(); // Populate the document list
});
function selectDocument(documentName) {
  if (!documentName) {
      console.error("Invalid document name:", documentName);
      return;
  }

  console.log(`Selecting document: ${documentName}`);

  const newUrl = `${window.location.pathname}?document=${encodeURIComponent(documentName)}`;
  if (window.location.href !== newUrl) {
      window.history.pushState({ documentName }, "", newUrl);
  }

  fetch(`/api/get-document-content/?document=${encodeURIComponent(documentName)}`)
      .then(response => response.json())
      .then(data => {
          if (data.content) {
              selectedDocument = data;

              fetch(`/api/get-annotations/?document_name=${encodeURIComponent(documentName)}`)
                  .then(response => response.json())
                  .then(annotations => {
                      console.log(`Fetched annotations for ${documentName}:`, annotations);

                      // Highlight annotations based on relevancy
                      let highlightedContent = data.content;
                      annotations.forEach(annotation => {
                          const regex = new RegExp(`(${annotation.content})`, "gi");
                          highlightedContent = highlightedContent.replace(
                              regex,
                              `<span class="highlight ${data.relevancy}-relevancy">${annotation.content}</span>`
                          );
                      });

                      const documentContainer = document.getElementById("documentContainer");
                      documentContainer.innerHTML = `<h2>${data.name}</h2><p>${highlightedContent}</p>`;

                      updateAnnotationsPane(annotations, data.relevancy);
                  })
                  .catch(error => console.error("Error fetching annotations:", error));
          } else {
              alert(data.error || "Document content not found.");
          }
      })
      .catch(error => console.error("Error fetching document content:", error));
}














function changeRelevancy(index, newRelevancy) {
  filteredDocuments[index].relevancy = newRelevancy;
  if (filteredDocuments[index] === selectedDocument) {
    selectDocument(index);
  }
}

function filterDocuments() {
  const searchText = document.getElementById("searchBox").value.trim();

  if (searchText === "") {
      renderDocumentList(); // Re-render all documents if the search is empty
      return;
  }

  fetch(`/api/search-documents/?search=${encodeURIComponent(searchText)}`)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert(data.error);
              return;
          }

          const documentList = document.getElementById("documentList");
          documentList.innerHTML = ""; // Clear the list

          data.forEach(doc => {
              const li = document.createElement("li");

              // Document link
              const docLink = document.createElement("a");
              docLink.href = "#"; // Prevent default navigation
              docLink.textContent = doc.name;
              docLink.onclick = () => selectDocument(doc.name); // Attach event to selectDocument

              // Relevancy dropdown
              const relevancySelect = document.createElement("select");
              relevancySelect.innerHTML = `
                  <option value="high" ${doc.relevancy === "high" ? "selected" : ""}>High</option>
                  <option value="low" ${doc.relevancy === "low" ? "selected" : ""}>Low</option>
              `;
              relevancySelect.onchange = () => updateDocumentRelevancy(doc.name, relevancySelect.value);

              li.appendChild(docLink);
              li.appendChild(relevancySelect);
              documentList.appendChild(li);
          });
      })
      .catch(error => console.error("Error filtering documents:", error));
}


function clearFilter() {
  document.getElementById("searchBox").value = ""; // Clear the search box
  renderDocumentList(); // Re-render the full document list
}

function toggleHighlighter() {
  highlighterEnabled = !highlighterEnabled;
  const highlighterButton = document.getElementById("highlightButton");
  highlighterButton.textContent = highlighterEnabled ? "Disable Highlighter" : "Enable Highlighter";
}

let selectedText = '';

function highlightText() {
  if (!highlighterEnabled) {
    console.log("Highlighter is disabled.");
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    const documentContainer = document.getElementById("documentContainer");
    let content = documentContainer.innerHTML;

    // Escape special characters in the selected text
    const escapedText = selectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedText})`, "g");

    // Replace selected text with highlighted version
    const highlighted = content.replace(
      regex,
      `<span class="highlight">${selectedText}</span>`
    );

    documentContainer.innerHTML = highlighted; // Update the DOM
    selection.removeAllRanges(); // Clear the selection
    showAnnotationPopup(selectedText); // Open annotation popup
  } else {
    console.log("No text selected.");
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

  if (!selectedDocument || !selectedDocument.name) {
    alert("No document selected.");
    return;
  }

  // Send annotation to backend
  fetch("/api/save-annotation/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document_name: selectedDocument.name,
      content: newAnnotation,
      highlight: selectedText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("Annotation saved successfully!");

        // Refresh the annotations in the right pane
        fetch(
          `/api/get-annotations/?document_name=${encodeURIComponent(
            selectedDocument.name
          )}`
        )
          .then((response) => response.json())
          .then((annotations) => {
            updateAnnotationsPane(annotations);
          });

        // Clear the textarea and close the popup
        textarea.value = "";
        closeAnnotationPopup();
      }
    })
    .catch((error) => console.error("Error saving annotation:", error));
}



function removeAnnotation(annotationId) {
  if (!confirm("Are you sure you want to delete this annotation?")) {
      return; // User canceled the action
  }

  // Send DELETE request to the backend
  fetch(`/api/delete-annotation/?id=${annotationId}`, { method: "DELETE" })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert(data.error); // Show an error if deletion fails
          } else {
              alert("Annotation removed successfully.");

              // Dynamically remove the annotation from the right pane
              const annotationDiv = document.querySelector(`.annotation-item[data-id="${annotationId}"]`);
              if (annotationDiv) {
                  annotationDiv.remove(); // Remove the annotation div from the DOM
              }

              // Optional: Refresh annotations if necessary
              // fetchAnnotationsForSelectedDocument();
          }
      })
      .catch(error => console.error("Error deleting annotation:", error));
}


// Auto-select a document on page load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const documentName = urlParams.get("document");

  if (documentName) {
      selectDocument(documentName);
  } else {
      console.log("No document selected on page load.");
  }

  renderDocumentList(); // Populate document list
});

// Close the annotation popup

function updateAnnotationsPane(annotations, relevancy) {
  const annotationsContainer = document.getElementById("annotationsContainer");
  annotationsContainer.innerHTML = ""; // Clear the container

  if (annotations.length === 0) {
      annotationsContainer.innerHTML = "<p>No annotations available for this document.</p>";
  } else {
      annotations.forEach(annotation => {
          const annotationDiv = document.createElement("div");
          annotationDiv.classList.add("annotation-item", `${relevancy}-relevancy`);
          annotationDiv.setAttribute("data-id", annotation.id); // Add unique identifier

          annotationDiv.innerHTML = `
              <p>${annotation.content}</p>
              <button onclick="editAnnotation(${annotation.id}, '${annotation.content}')">Edit</button>
              <button onclick="removeAnnotation(${annotation.id})">Remove</button>
          `;

          annotationsContainer.appendChild(annotationDiv);
      });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded. Rendering document list and loading preselected document...");
  renderDocumentList();
  loadDocumentFromURL();
});


function closeAnnotationPopup() {
  document.getElementById("annotationPopup").style.display = "none";
}

renderDocumentList();
function uploadDocuments() {
  const fileInput = document.getElementById("fileUpload");
  const files = fileInput.files;

  if (files.length === 0) {
    alert("No files selected for upload.");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type === "text/plain") {
      const formData = new FormData();
      formData.append("file", file); // Add file to the FormData object

      fetch("/upload-file/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(`Error uploading file: ${data.error}`);
          } else {
            alert(`File uploaded successfully: ${data.file_name}`);
            console.log(`File URL: ${data.file_url}`);
            renderDocumentList(); // Refresh document list to include the new file
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      alert("Please upload only .txt files.");
    }
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

// Check query parameters for the selected document
// let urlParams = new URLSearchParams(window.location.search);
// let documentName = urlParams.get('document');

// Automatically select the document if present in the query parameters
if (documentName) {
    selectDocument(documentName);
} else {
    console.log("No document selected on page load.");
}

function editAnnotation(annotationId, currentContent) {
  const textarea = document.getElementById("annotationText");
  textarea.value = currentContent; // Prefill with current content

  // Open the popup for editing
  const popup = document.getElementById("annotationPopup");
  popup.style.display = "block";

  // Update the save button to handle editing
  const saveButton = document.querySelector("#annotationPopup button");
  saveButton.onclick = function () {
      const updatedContent = textarea.value.trim();

      if (updatedContent === "") {
          alert("Please enter a valid annotation.");
          return;
      }

      // Update the annotation in the backend
      fetch(`/api/update-annotation/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              id: annotationId,
              content: updatedContent
          })
      })
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  alert(data.error);
              } else {
                  alert("Annotation updated successfully!");

                  // Update the annotation in the UI dynamically
                  const annotationDivs = document.querySelectorAll(".annotation-item");
                  annotationDivs.forEach(div => {
                      if (div.textContent.includes(currentContent)) {
                          div.innerHTML = `
                              <p>${updatedContent}</p>
                              <button onclick="editAnnotation(${annotationId}, '${updatedContent}')">Edit</button>
                              <button onclick="removeAnnotation(${annotationId})">Remove</button>
                          `;
                      }
                  });
              }
          })
          .catch(error => console.error("Error updating annotation:", error));

      // Close the popup
      popup.style.display = "none";
  };
}

