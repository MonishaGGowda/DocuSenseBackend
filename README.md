# DocuSense: A Multi-Agent System for Streamlined Document Annotation and Insights Generation  

## Team Members  
- **Monisha Govindegowda**  
- **Piyush Girish Deshpande**  
- **Manasvi Reddy Kothakota**  

---
<img width="2842" height="1598" alt="image" src="https://github.com/user-attachments/assets/679895a7-00b2-4a79-a68e-4f02d2499722" />

## Introduction to DocuSense  

Imagine going through a mountain of documents, trying to connect the dots, uncover hidden insights, and make sense of complex information. For many, this is the reality of data analysis. Traditional methods are tedious, requiring manual annotation, repetitive navigation, and significant mental effort. The risk of missing critical insights or making errors is high, especially with large datasets. Existing tools often add frustration with complicated workflows and steep learning curves.  

**DocuSense** transforms this process, offering a **powerful and user-friendly** solution. It simplifies how users interact with and analyze data, reducing complexity and inefficiency. Through an integration of **artificial intelligence and intuitive design**, DocuSense enables users to annotate documents, generate insights, and cross-reference information with ease.  

### Purpose  
This research explores how integrating **AI agents for summarizing insights from documents** can reduce cognitive load and enhance efficiency in data exploration. This approach aims to improve decision-making and user experience in document sensemaking tasks.  

---

## Target Audience  

DocuSense is designed for:  

- **Crime Solvers:** Helps manage large datasets, uncover critical connections, and improve investigative efficiency.  
- **Researchers:** Organizes, analyzes, and summarizes complex information for meaningful insights.  
- **Students:** Enhances analytical skills and simplifies academic projects into manageable learning experiences.  

---

## Key Features  

### 1. Annotations and Highlighting  
- Users can highlight text and annotate content.  
- Annotations can be sorted and filtered by relevance.  
- Real-time updates across all relevant pages.  
- Edit and delete functionality for flexibility.  

### 2. AI-Generated Insights  
- **Large Language Models (LLMs)** generate summaries and insights.  
- Users can enter queries for summarized answers.  
- Customizable AI prompts for tailored outputs.  

### 3. Connections Page for Cross-Referencing  
- Comprehensive view of all annotations with traceable links to source documents.  
- Tools to link annotations based on content relevancy.  
- **Search feature** for quick lookup of annotations.  

### 4. Document Filter & Link Finder  
- Filter documents based on text content in **Data Analysis Page** and **Connections Page**.  
- Identify common connections between documents.  
- Example: In crime-related documents, filter by a person’s name to extract relevant documents.  

### 5. Streamlined User Interface  
- Clear, structured navigation across login, homepage, analysis annotation, and connections pages.  
- **Minimal mental strain** and improved usability.  

### 6. Simplified Document Management  
- Upload options, clear document listings, and easy deletion features.  
- **Visually categorized files and annotations** for better organization.  

---

## Setup Instructions  

### System Requirements  
1. **Python** 3.x or higher  
2. **Django** 3.x or higher  
3. **Pipenv** for dependency management  
4. **Stable internet connection** for Gemini AI integration  

### Steps to Setup  

1. **Clone the Repository**  
 ```sh
 git clone https://github.com/MonishaGGowda/DocuSenseBackend.git
 cd DocuSense
 cd docusense
```
2. **Set Up Virtual Environment & Install Dependencies**
```sh
pipenv install
python3 -m venv venv
source venv/bin/activate  # For Mac/Linux
venv\Scripts\activate     # For Windows
pip install django
pip install -r requirements.txt
```
3. **Apply Migrations**
```sh
python manage.py makemigrations
python migrate
```
4. **Run the Server**
```sh
python manage.py runserver
```
5. **Access the Application**
```sh
http://127.0.0.1:8000
```


