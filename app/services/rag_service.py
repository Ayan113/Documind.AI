import os
import asyncio
from typing import AsyncGenerator
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_groq import ChatGroq
from app.core.config import settings

class RAGService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)
        self.vector_store_path = settings.VECTOR_STORE_PATH
        self.vector_store = self._load_or_create_vector_store()
        
        # We will initialize Groq LLM but it can be swapped later
        if settings.GROQ_API_KEY:
            self.llm = ChatGroq(
                model=settings.LLM_MODEL, 
                api_key=settings.GROQ_API_KEY, 
                streaming=True,
                temperature=0.3
            )
        else:
            self.llm = None
            
    def _load_or_create_vector_store(self) -> FAISS:
        if os.path.exists(self.vector_store_path) and os.path.exists(os.path.join(self.vector_store_path, "index.faiss")):
            return FAISS.load_local(
                self.vector_store_path, 
                self.embeddings,
                allow_dangerous_deserialization=True # Need to allow for local FAISS
            )
        else:
            # Create empty vector store, needs dummy text to initialize the index structure
            empty_faiss = FAISS.from_texts(["initialization dummy text"], self.embeddings)
            # Remove dummy immediately
            empty_faiss.delete([list(empty_faiss.docstore._dict.keys())[0]])
            if not os.path.exists(self.vector_store_path):
                os.makedirs(self.vector_store_path)
            empty_faiss.save_local(self.vector_store_path)
            return empty_faiss

    def add_documents(self, chunks: list[Document]):
        """Adds document chunks to the FAISS vector store and saves to disk"""
        self.vector_store.add_documents(chunks)
        self.vector_store.save_local(self.vector_store_path)

    def search_documents(self, query: str, top_k: int = settings.TOP_K, document_filter: list[str] = None):
        """
        Retrieves relevant documents. If document_filter is provided, only searches within those documents.
        """
        # Note: FAISS metadata filtering is limited compared to Chroma/Pinecone.
        # But we can retrieve more and post-filter.
        docs = self.vector_store.similarity_search(query, k=top_k * 3) # Fetch more to allow filtering
        
        filtered_docs = []
        for doc in docs:
            if document_filter and (doc.metadata.get("source") not in document_filter):
                continue
            filtered_docs.append(doc)
            
            if len(filtered_docs) >= top_k:
                break
                
        return filtered_docs

    async def generate_chat_stream(self, query: str, history: list[dict], selected_docs: list[str] = None) -> AsyncGenerator[str, None]:
        """
        Streams response back using ChatGroq.
        history format: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
        """
        if not self.llm:
            yield '{"error": "LLM Provider is not configured. Please set GROQ_API_KEY in .env"}'
            return

        # 1. Retrieve Context
        relevant_docs = []
        if selected_docs and len(selected_docs) > 0:
            relevant_docs = self.search_documents(query, top_k=settings.TOP_K, document_filter=selected_docs)
        
        # 2. Extract sources mapped to chunks
        sources = []
        context_texts = []
        for doc in relevant_docs:
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", 1)
            sources.append({"source": source, "page": page, "snippet": doc.page_content[:200] + "..."})
            context_texts.append(f"[Source: {source}, Page: {page}]\n{doc.page_content}")
            
        context_str = "\n\n".join(context_texts) if context_texts else "No context loaded or found."

        # 3. Construct System Prompt
        system_prompt = f"""You are Documind, an advanced AI Assistant analyzing user-provided documents.
Always answer accurately based ONLY on the provided context if context is given. If the answer cannot be found in the context, say "I don't have enough information in the provided documents to answer that." 
Cite your sources cleanly using providing page numbers appropriately, e.g. [Page 3].

Context:
{context_str}
"""
        messages = [SystemMessage(content=system_prompt)]
        
        for msg in history:
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg.get("content")))
            elif msg.get("role") == "assistant":
                messages.append(AIMessage(content=msg.get("content")))
                
        messages.append(HumanMessage(content=query))

        # 4. Stream response
        import json
        sources_json_str = json.dumps({"type": "sources", "data": sources})
        yield sources_json_str + "\\n\\n"
        
        async for chunk in self.llm.astream(messages):
            # Send just the raw content chunk. We use SSE format in the router.
            if chunk.content:
                data = json.dumps({"type": "token", "data": chunk.content})
                yield data + "\\n\\n"
                
rag_service = RAGService()
