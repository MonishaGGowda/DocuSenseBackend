document.getElementById("documentContainer").addEventListener("mouseup", highlightText);

function toggleSummary() {
    const summaryType = getCheckedSummaryType();
    const summaryContainer = document.getElementById('summaryContainer');
    let summaryContent = "";
    const urlParamsAnalysis = new URLSearchParams(window.location.search);
    let analysisName = urlParamsAnalysis.get('analysis');
  
    if (!analysisName) {
      analysisName = Object.keys(analysisToDocumentsMap).find(key =>
        analysisToDocumentsMap[key].includes(docName)
      );
    }
    if(summaryType == 'file'){
    summaryContent += `<p><strong>${selectedDocument.name}:</strong> ${selectedDocument.summary}</p>`;
    }
    else{
      summaryContent += `<p><strong>Summary:</strong> Lady Margaret has gone missing just days before her 80th birthday. Web of jealousy and deceit to uncover.Chilling phone call echoes through the old Whitmore estate, every night at precisely midnight. Art collector Julian Hart, carved puzzle box at an estate sale.</p>`;
    }
  
    const isVisible = summaryContainer.style.display === 'block';
    summaryContainer.style.display = isVisible ? 'none' : 'block';
  
    if (!isVisible) {
      summaryContainer.style.flexBasis = '75%';
      document.querySelector('.button-container').style.flexBasis = '25%';
    } else {
      summaryContainer.style.flexBasis = '0';
      document.querySelector('.button-container').style.flexBasis = '100%';
    }
    summaryContainer.innerHTML = !isVisible && summaryContent ? summaryContent : '';
  }
  