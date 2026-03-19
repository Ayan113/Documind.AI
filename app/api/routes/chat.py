from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from app.services.rag_service import rag_service

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    query: str
    history: List[ChatMessage] = []
    selected_docs: Optional[List[str]] = None

@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """
    Streams the LLM response utilizing SSE.
    """
    try:
        # Convert Pydantic history back to dict for the service
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in req.history]
        
        # We return a StreamingResponse which consumes the AsyncGenerator
        return StreamingResponse(
            rag_service.generate_chat_stream(req.query, history_dicts, req.selected_docs),
            media_type="text/event-stream"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
