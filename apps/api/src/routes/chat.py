"""
Chat routes for Tutor Agent interaction.
"""

from fastapi import APIRouter, HTTPException
from src.agents.tutor import get_tutor_agent
from src.models import ChatMessageRequest, TutorResponse
from pydantic import BaseModel
import logging

router = APIRouter(prefix="/api/chat", tags=["chat"])
logger = logging.getLogger(__name__)


class ChatRequest(BaseModel):
    session_id: str
    message: str
    class_id: str
    section_id: str | None = None


@router.post("/message", response_model=dict)
async def send_message(request: ChatRequest):
    """
    Send a message to the Tutor Agent.
    
    The Tutor Agent will:
    1. Search Qdrant for relevant content (RAG)
    2. Use web search if needed (fallback)
    3. Generate explanation with examples
    4. Provide follow-up questions
    5. Suggest next action (continue/quiz/next_section)
    """
    try:
        logger.info(f"Chat message from session {request.session_id}: {request.message[:50]}...")
        
        # TODO: Call Tutor Agent
        # tutor = get_tutor_agent()
        # response = await tutor.run({
        #     "session_id": request.session_id,
        #     "message": request.message,
        #     "class_id": request.class_id,
        #     "section_id": request.section_id
        # })
        
        # Mock response for now
        mock_response = {
            "explanation": f"Great question! Let me explain based on the course material...",
            "examples": [
                "Example 1 from your textbook...",
                "Example 2 showing this concept..."
            ],
            "key_concepts": ["Main concept 1", "Main concept 2"],
            "follow_up_questions": [
                "Can you explain how this relates to...?",
                "What do you think happens when...?"
            ],
            "depth_adjustment": "appropriate",
            "next_action": "continue"
        }
        
        return {
            "success": True,
            "response": mock_response,
            "message": "Tutor agent response (agents require OpenAI key to run)"
        }
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session."""
    # TODO: Implement chat history retrieval
    return {
        "session_id": session_id,
        "messages": [],
        "message": "Chat history (requires database implementation)"
    }
