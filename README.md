# Don't Panic: Neural Clinical Dashboard 🧬

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange.svg)](https://ai.google.dev/)
[![Chroma](https://img.shields.io/badge/Vector_DB-Chroma-purple.svg)](https://www.trychroma.com/)

**Don't Panic** is a futuristic, highly polished clinical dashboard designed to demystify complex medical lab reports. Rather than overwhelming users with raw numbers and alarming medical jargon, it uses an advanced Retrieval-Augmented Generation (RAG) AI pipeline to extract data and present it in a calm, informative, and actionable "Zen" state.

![Dashboard View 1](./UI%20Images/Home.png)
![Dashboard View 2](./UI%20Images/Uploading%20file.png)
![Dashboard View 3](./UI%20Images/rendering%20file.png)
![Dashboard View 4](./UI%20Images/results1.png)
![Dashboard View 5](./UI%20Images/results2.png)

## ✨ Core Features

*   **Clinical Neutralization Pipeline:** Upload any clinical lab report (PDF or Image). The system extracts the biomarkers, cross-references them against a local ChromaDB clinical knowledge base, and outputs safe, normalized guidance.
*   **"Zen" User Interface:** Medical data shouldn't induce anxiety. The UI leverages glassmorphism, fluid Framer Motion animations, and calming visual hierarchies to bring clarity to health data.
*   **AI Interpretation:** Powered by Google Gemini and OpenRouter (DeepSeek), it translates technical terms ("Hyperlipidemia") into actionable, understandable insight ("Elevated LDL - Area for adjustment").
*   **Dynamic Dashboard:** Automatically pinpoints the most volatile or important metrics to display prominently, alongside a custom-generated "Morning Routine Boost" based on your current health snapshot.
*   **Secure Authentication:** End-to-End JWT authentication ensuring only you have access to your clinical profile.

---

## 🛠️ Tech Stack

**Frontend:**
*   [React 19](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [TailwindCSS 3](https://tailwindcss.com/)
*   [Framer Motion](https://www.framer.com/motion/)
*   [Lucide Icons](https://lucide.dev/)

**Backend:**
*   [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   [SQLAlchemy](https://www.sqlalchemy.org/) & SQLite (User Database)
*   [ChromaDB](https://www.trychroma.com/) (Vector Database for RAG)
*   [Google GenAI SDK](https://github.com/google/generative-ai-python)
*   [pdfplumber](https://github.com/jsvine/pdfplumber) (Document Parsing)

---

## 🚀 Getting Started

Follow these instructions to run the **Don't Panic** dashboard on your local machine.

### Prerequisites
*   Node.js (v18+)
*   Python 3.10+
*   A [Google Gemini API Key](https://aistudio.google.com/)
*   An [OpenRouter API Key](https://openrouter.ai/)

### 1. Clone the Repository
```bash
git clone https://github.com/Praveen3333P/Don-t-Panic--Clinical-Dashboard-powered-by-a-RAG-Model.git
cd Don-t-Panic--Clinical-Dashboard-powered-by-a-RAG-Model
```

### 2. Frontend Setup
Install the required Node dependencies:
```bash
npm install
```

### 3. Backend Setup
Navigate to the `server/` directory and set up your Python virtual environment.

```bash
# Move into server directory
cd server

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Environment Variables
Inside the `server/` directory, create a `.env` file and add your credentials:

```ini
# server/.env
GEMINI_API_KEY="your_gemini_api_key_here"
OPENROUTER_API_KEY="your_openrouter_api_key_here"
SECRET_KEY="a_super_secret_random_string_for_jwt_tokens"
```

### 5. Running the Application
You will need two terminal windows to run both the frontend and the backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
.\venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`. 
1. Create a "Neural Profile" by signing up.
2. Log in.
3. Upload a lab report (PDF/Image) to trigger the neutralization process.

---

## 🧠 How the AI Pipeline Works

1.  **Ingestion:** The user uploads a lab report via the React UI.
2.  **Extraction:** FastAPI routes the file to the `gemini_service.py`, which uses either `pdfplumber` (for PDFs) or Vision (for images) to construct a clean JSON array of all recognized biomarkers and their values.
3.  **Retrieval (RAG):** The system passes each extracted biomarker through `rag_engine.py`, searching a local `chroma_db` vector store for established clinical context, reference ranges, and safety boundaries.
4.  **Synthesis:** The extracted numbers and retrieved context are sent to the LLM (OpenRouter/DeepSeek/Gemini) with a strict "Zen Persona" system prompt. This ensures the output is informative, formatted accurately into our UI schema, and free of panic-inducing medical jargon.
5.  **Render:** The React frontend consumes the finalized JSON and fluidly renders the highly customized dashboard for the user. 

---

## 🛡️ License

This project is licensed under the MIT License.

> **Disclaimer:** This application is for educational and demonstrative purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
