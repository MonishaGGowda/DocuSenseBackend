document.getElementById("documentContainer").addEventListener("mouseup", highlightText);

function toggleSummary() {
  // Ensure a document is selected
  if (!selectedDocument || !selectedDocument.name) {
      console.error("No document selected or selectedDocument.name is undefined.");
      alert("Please select a document to generate its summary.");
      return;
  }

  const summaryType = getCheckedSummaryType(); // File or Entire Analysis
  const summaryContainer = document.getElementById("summaryContainer");
  let url = "/api/generate-summary/";

  console.log("Selected summary type:", summaryType); // Debug log

  if (summaryType === "file") {
      url += `?document_name=${encodeURIComponent(selectedDocument.name)}`;
  } else if (summaryType === "entire") {
      url += `?all_documents=true`;
  }

  // Fetch the summary from the backend
  fetch(url)
      .then((response) => response.json())
      .then((data) => {
          if (data.summary) {
              summaryContainer.style.display = "block";

              try {
                  // Attempt to parse the summary as JSON
                  const summaryObject = JSON.parse(data.summary);
                  summaryContainer.innerHTML = `<h2>Summary</h2>${formatSummaryAsHtml(summaryObject)}`;
              } catch (e) {
                  console.log("Summary is not JSON. Rendering as plain text.");
                  summaryContainer.innerHTML = `<h2>Summary</h2><p>${data.summary}</p>`;
              }
          } else {
              alert(data.error || "Error generating summary.");
          }
      })
      .catch(error => {
          console.error("Error fetching summary:", error);
          alert("An unexpected error occurred while fetching the summary.");
      });
}


// Helper function to format JSON summaries as HTML
function formatSummaryAsHtml(summaryObject) {
  let html = "";
  for (const [key, value] of Object.entries(summaryObject)) {
    if (typeof value === "object" && value !== null) {
      html += `<p><strong>${key}:</strong></p><ul>`;
      for (const [subKey, subValue] of Object.entries(value)) {
        html += `<li><strong>${subKey}:</strong> ${subValue}</li>`;
      }
      html += `</ul>`;
    } else {
      html += `<p><strong>${key}:</strong> ${value}</p>`;
    }
  }
  return html;
}

// Helper function to get the selected summary type
function getCheckedSummaryType() {
  const checkedRadioButton = document.querySelector('input[name="summaryType"]:checked');
  return checkedRadioButton ? checkedRadioButton.value : null;
}


function selectDocument(documentName) {
  if (!documentName) {
      console.error("Invalid document name:", documentName);
      return;
  }

  console.log(`Selecting document: ${documentName}`);

  // Fetch document content
  fetch(`/api/get-document-content/?document=${encodeURIComponent(documentName)}`)
      .then(response => response.json())
      .then(data => {
          if (data.content) {
              // Update selected document
              selectedDocument = data;

              // Update center pane
              const documentContainer = document.getElementById("documentContainer");
              documentContainer.innerHTML = `<h2>${data.name}</h2><p>${data.content}</p>`;

              // Fetch annotations for the document
              fetch(`/api/get-annotations/?document_name=${encodeURIComponent(documentName)}`)
                  .then(response => response.json())
                  .then(annotations => {
                      console.log(`Fetched annotations for ${documentName}:`, annotations);
                      updateAnnotationsPane(annotations); // Update the right pane
                  })
                  .catch(error => console.error("Error fetching annotations:", error));
          } else {
              alert(data.error || "Document content not found.");
          }
      })
      .catch(error => console.error("Error fetching document content:", error));
}


  