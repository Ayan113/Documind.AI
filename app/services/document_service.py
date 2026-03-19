import os
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings

def extract_text_with_metadata(file_path: str, filename: str) -> list[dict]:
    """
    Extracts text from a PDF file page by page and attaches metadata.
    Returns a list of dicts: {"text": "...", "metadata": {"source": filename, "page": page_number}}
    """
    reader = PdfReader(file_path)
    pages_data = []
    
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            pages_data.append({
                "text": text,
                "metadata": {
                    "source": filename,
                    "page": i + 1 
                }
            })
            
    return pages_data

def chunk_documents(pages_data: list[dict]) -> list:
    """
    Splits the extracted pages into smaller chunks while carrying over metadata.
    Returns LangChain Document objects.
    """
    from langchain.schema import Document
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE, 
        chunk_overlap=settings.CHUNK_OVERLAP
    )
    
    documents = []
    for data in pages_data:
        doc = Document(page_content=data["text"], metadata=data["metadata"])
        documents.append(doc)
        
    # Split the documents
    chunks = splitter.split_documents(documents)
    
    # Add chunk index to metadata
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_index"] = i
        
    return chunks
