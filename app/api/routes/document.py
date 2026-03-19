from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import shutil
import os
from typing import List
from app.services.document_service import extract_text_with_metadata, chunk_documents
from app.services.rag_service import rag_service

router = APIRouter()

# Store mapping of uploaded documents (In a real app, this goes to DB)
UPLOADED_FILES = []

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    """Handles multiple PDF uploads, extracts text, chunks, and stores into the Vector DB"""
    try:
        os.makedirs("data/uploads", exist_ok=True)
        results = []
        
        for file in files:
            if not file.filename.endswith('.pdf'):
                continue
                
            file_location = f"data/uploads/{file.filename}"
            with open(file_location, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            # Extra text and structure chunks
            pages_data = extract_text_with_metadata(file_location, file.filename)
            chunks = chunk_documents(pages_data)
            
            # Add to FAISS
            rag_service.add_documents(chunks)
            
            if file.filename not in UPLOADED_FILES:
                UPLOADED_FILES.append(file.filename)
                
            results.append({"filename": file.filename, "chunks": len(chunks), "pages": len(pages_data)})
            
        return {"message": "Files processed and indexed successfully", "details": results, "all_docs": UPLOADED_FILES}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_documents():
    """Returns list of currently available documents"""
    return {"documents": UPLOADED_FILES}
