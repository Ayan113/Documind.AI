# Documind.AI 🧠📄

**An Advanced, Production-Ready Generative AI Platform for Interacting with Documents**

Documind.AI is a highly polished, full-stack application that transforms static PDFs into interactive, intelligent agents. Built with modern GenAI patterns, it extracts, chunks, embeds, and retrieves document contexts to power an intuitive, ChatGPT-like conversational interface. 

---

## 🔥 Features
- **Multi-Document Support**: Upload multiple PDFs simultaneously and seamlessly toggle contexts to query specific documents or the entire library.
- **Smart RAG Pipeline**: Combines FAISS vector search with metadata chunking to bring you precise answers.
- **Live Token Streaming**: Low-latency, fluid typing effect mimicking industry-leading LLMs like ChatGPT and Claude.
- **Source Attribution**: Transparently cites the exact page number and snippet the AI used to answer your question.
- **Stunning UI/UX**: Built with React, Tailwind CSS, and Framer Motion for a premium, responsive, dark-themed experience with native Drag & Drop.

---

## 🏗️ Architecture Stack

### Backend (FastAPI)
- **Framework**: `FastAPI` + `Uvicorn` for high-performance async routing.
- **RAG Engine**: `LangChain`, `HuggingFace Embeddings` (all-MiniLM-L6-v2), and local `FAISS`.
- **LLM**: Powered by `Groq` (Llama 3 8B) for ultra-fast, cheap token generation (configurable to OpenAI/Ollama).
- **Architecture**: Modular Services/Routes pattern with Pydantic validations.

### Frontend (React + Vite)
- **Framework**: `React` (via `Vite`)
- **Styling**: `Tailwind CSS` with `@tailwindcss/typography` & `Inter` font.
- **Interactions**: `Framer Motion` for page and chat animations.
- **API Handling**: Custom Fetch-based wrapper parsing SSE (Server-Sent Events) for real-time streaming.

---

## 🚀 Local Setup

### 1. Backend

1. Navigate to the project root and create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install sse-starlette python-multipart langchain-groq langchain-huggingface sentence-transformers
   ```
3. Set up environment variables in `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   VECTOR_STORE_PATH=data/vectorstore
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### 2. Frontend

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the displayed `localhost` URL in your browser.

---

## 🌐 Deployment (Production)

This project is primed for easy deployment:

**Backend (Render / Railway)**: 
The repository includes a `Dockerfile` and a `render.yaml` template. Simply connect your GitHub repository to Render/Railway and they will auto-build the Docker container. 
*(Note: Be sure to set your `GROQ_API_KEY` in the service environment variables).*

**Frontend (Vercel)**:
Connect the `frontend` directory directly to Vercel. A `vercel.json` file is included to properly route the React single-page application. Update the `API_BASE_URL` in `src/services/api.js` to point to your deployed backend URL.

---

## 💡 Future Improvements
- Add persistent relational database (PostgreSQL + pgvector) for storing chat history and user accounts.
- Implement Hybrid Search (Keyword + Vector) using BM25.
- Add Re-ranking (e.g., Cohere Rerank) to the pipeline for higher accuracy. 

*Designed and engineered for efficiency, clarity, and scale.*
