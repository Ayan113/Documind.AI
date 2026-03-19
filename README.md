# Documind.AI 🧠📄

Documind.AI is a full-stack Generative AI application that allows users to interact with PDF documents through a chat-based interface.

The system uses a Retrieval-Augmented Generation (RAG) pipeline to process documents — extracting text, splitting it into chunks, generating embeddings, and retrieving relevant context to answer user queries.

Instead of manually searching through long PDFs, users can upload documents and ask questions to get context-aware answers along with source references.

---

🔥 Features

- Multi-Document Support  
  Upload and query multiple PDFs, with the ability to switch context between documents.

- RAG-Based Search  
  Uses FAISS vector search with semantic embeddings to retrieve relevant document chunks.

- Streaming Responses  
  Answers are streamed token-by-token to improve responsiveness.

- Source Attribution  
  Displays the relevant document snippets and page references used in generating answers.

- Clean Chat UI  
  Chat-based interface built with React and Tailwind CSS, including drag-and-drop upload and smooth interactions.

---

🏗️ Tech Stack

Backend:
- FastAPI (Python)
- LangChain (RAG pipeline)
- FAISS (vector database)
- sentence-transformers (embeddings)

LLM:
- LLaMA 3 via Groq (can be swapped with OpenAI/Ollama)

Frontend:
- React (Vite)
- Tailwind CSS
- Framer Motion (animations)

---

⚙️ How It Works

1. User uploads a PDF  
2. Text is extracted and split into chunks  
3. Chunks are converted into embeddings  
4. Stored in FAISS vector database  
5. On query:
   - Relevant chunks are retrieved
   - Passed to LLM with the question
   - Answer is generated with context

---

🚀 Local Setup

Backend:

python -m venv venv  
source venv/bin/activate  

pip install -r requirements.txt  

Create `.env`:

GROQ_API_KEY=your_api_key  
VECTOR_STORE_PATH=data/vectorstore  

Run server:

uvicorn app.main:app --reload  

---

Frontend:

cd frontend  
npm install  
npm run dev  

---

🌐 Deployment

Backend:
- Deploy using Render or Railway (Dockerfile + render.yaml included)

Frontend:
- Deploy on Vercel
- Update API base URL to backend service

---

💡 Future Improvements

- Add chat history persistence (PostgreSQL / pgvector)
- Improve retrieval with hybrid search (BM25 + vector)
- Add re-ranking for better answer accuracy
- Authentication + user sessions

---

This project was built to understand and implement real-world RAG systems and end-to-end AI application workflows.
